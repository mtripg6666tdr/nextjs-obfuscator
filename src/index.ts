import type { NextConfig } from "next";

import * as path from "path";

import { obfuscate } from "javascript-obfuscator";
import { Minimatch } from "minimatch";
import webpack, { sources } from "webpack";

import { LoggerSymbol, type NextjsObfuscatorOptions } from "./type";

type PluginOptions = {
  enabled: boolean | "detect",
  /**
   * determines which files to be obfuscated
   */
  patterns: string[],
  /**
   * Additional files to be obfuscated
   */
  obfuscateFiles: Partial<{
    buildManifest: boolean,
    ssgManifest: boolean,
    webpack: boolean,
    additionalModules: string[],
  }>,
  /**
   * indicates whether the plugin logs to console
   */
  log: boolean,
};

const craeteError = (message = "An error occurred.") =>
  new Error(`${message} If you think this is a bug of nextjs-obfuscator, please file an issue at https://github.com/mtripg6666tdr/nextjs-obfuscator/issues`);

type ObjectWithUnconstantString<T extends Record<any, any>> = {
  [key in keyof T]: Required<T>[key] extends string
    ? string
    : Required<T>[key] extends number
      ? number
      : Required<T>[key] extends string[]
        ? string[]
        : Required<T>[key] extends number[]
          ? number[]
          : Required<T>[key] extends Record<any, any>
            ? Partial<ObjectWithUnconstantString<T[key]>>
            : T[key]
};

function main(
  obfuscatorOptions: NextjsObfuscatorOptions | Partial<ObjectWithUnconstantString<NextjsObfuscatorOptions>>,
  pluginOptions?: Partial<PluginOptions>
) {
  // initialize options
  pluginOptions = Object.assign({
    enabled: "detect",
    patterns: [
      "./**/*.js",
      "./**/*.jsx",
      "./**/*.ts",
      "./**/*.tsx",
    ],
    log: false,
  }, pluginOptions);
  pluginOptions.obfuscateFiles = Object.assign({
    buildManifest: false,
    ssgManifest: false,
    webpack: false,
    additionalModules: [],
  }, pluginOptions.obfuscateFiles);

  const logger: ((...message: string[]) => void) = pluginOptions.log ? console.log.bind(console, "\n") : () => {};
  const matchers = pluginOptions.patterns!.map(pattern => new Minimatch(pattern));

  return function(nextConfig: NextConfig) {
    if(!nextConfig || typeof nextConfig !== "object"){
      throw new TypeError("Invalid configuration object passed.");
    }

    const moduleRegEx = /\.(tsx|ts|js|cjs|mjs|jsx)$/;

    const originalWebpackFn = nextConfig.webpack;
    nextConfig.webpack = function(config: webpack.Configuration, context){
      // @ts-ignore
      if(pluginOptions.writeConfig){
        require("fs").writeFileSync(
          `./webpack-config-${Date.now()}.temp.json`,
          JSON.stringify(
            config,
            (key, value) => value instanceof RegExp
              ? { "[__type]": "RegExp", value: value.toString() }
              : typeof value === "bigint"
                ? { "[__type": "BigInt", value: value.toString() }
                : value,
            "  "
          )
        );
      }

      const basePath = config.context!;

      if(!basePath){
        throw craeteError("No context detected.");
      }

      const moduleMatcher = (value: string) => {
        if(moduleRegEx.test(value)){
          if(!value.includes("node_modules")){
            const relativePath = `.${path.sep}${path.relative(basePath, value)}`;
            logger("Detected:", relativePath);

            if(
              matchers.some(matcher => {
                const matched = matcher.match(relativePath);
                if(matched){
                  logger("Matched:", relativePath, `(pattern: ${matcher.pattern})`);
                }
                return matched;
              })
            ){
              return true;
            }
          }else{
            const matched = pluginOptions.obfuscateFiles!.additionalModules!.some(mod => value.includes(`${path.sep}node_modules${path.sep}${mod}`));
            if(matched){
              logger("Matched:", value);
            }
            return matched;
          }
        }
        return false;
      };

      // obfuscate only if the chunk is for browser
      if(
        pluginOptions.enabled === true || (pluginOptions.enabled === "detect" && !context.dev)
      ){
        if(
          !context.isServer
          && !context.nextRuntime
          && config.module?.rules
        ){
          config.module.rules.unshift({
            test: moduleMatcher,
            enforce: "post" as const,
            use: {
              loader: require.resolve("./loader"),
              options: Object.assign({
                [LoggerSymbol]: logger,
              }, obfuscatorOptions),
            },
          });

          const buildId = context.buildId;

          if(!buildId){
            throw craeteError("No buildId found.");
          }

          if(Object.values(pluginOptions.obfuscateFiles!).some(val => val)){
            config.plugins!.push(
              new NextJSObfuscatorPlugin(
                obfuscatorOptions as NextjsObfuscatorOptions,
                buildId,
                pluginOptions.obfuscateFiles!,
                logger,
              )
            );
          }
        }
      }

      // by using below code we can obfuscator server components but at most cases it is not necessary
      // const appDirEnabled = (
      //   config.plugins?.find(p => p && typeof p === "object" && "appDirEnabled" in p) as ({ appDirEnabled: boolean } | undefined)
      // )?.appDirEnabled;

      // if(appDirEnabled && context.isServer && context.nextRuntime === "nodejs"){
      //   config.module!.rules!.unshift({
      //     test: moduleMatcher,
      //     enforce: "post",
      //     use: {
      //       loader: require.resolve("./loader"),
      //       options: Object.assign({
      //         [LoggerSymbol]: logger,
      //       }, obfuscatorOptions, {
      //         target: "node",
      //         domainLock: [],
      //       }),
      //     },
      //   });
      // }

      if(originalWebpackFn){
        return originalWebpackFn(config, context);
      }
      return config;
    };

    return nextConfig;
  };
}

export = main;

class NextJSObfuscatorPlugin {
  protected logger: ((...messages: any[]) => void);
  protected obfuscatorOptions: NextjsObfuscatorOptions;

  constructor(
    obfuscatorOptions: NextjsObfuscatorOptions,
    protected buildId: string,
    protected target: PluginOptions["obfuscateFiles"],
    logger: (...messages: any[]) => void,
  ) {
    this.logger = (...messages: any[]) => logger("(Plugin)", ...messages);
    this.obfuscatorOptions = Object.assign(obfuscatorOptions, {
      splitStrings: false,
    });
  }

  apply(compiler: webpack.Compiler) {
    const PluginName = this.constructor.name;

    compiler.hooks.compilation.tap(
      PluginName,
      (compilation) => {
        compilation.hooks.processAssets.tap({
          name: PluginName.slice(0, -6),
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING,
        }, (assets) => {
          this.logger("Initialized");
          const assetNames = Object.keys(assets);
          this.logger(assetNames);

          for(let i = 0; i < assetNames.length; i++){
            const assetName = assetNames[i];

            if(
              (this.target.webpack && assetName.match(/^static\/chunks\/webpack-[abcdef\d]+\.js$/))
              || (this.target.buildManifest && assetName === `static/${this.buildId}/_buildManifest.js`)
              || (this.target.ssgManifest && assetName === `static/${this.buildId}/_ssgManifest.js`)
            ){
              const asset = assets[assetName];
              if(!asset) return;
              const source = asset.source() as string;
              const obfuscatedCode = obfuscate(source, this.obfuscatorOptions).getObfuscatedCode();
              assets[assetName] = new sources.RawSource(`!function(){${obfuscatedCode}}()`, false);
              this.logger("Obfuscated:", assetName, source.length, "->", obfuscatedCode.length);
            }
          }
        });
      }
    );
  }
}
