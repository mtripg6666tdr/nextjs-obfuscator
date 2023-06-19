const { Compilation, sources } = require("webpack");
const { obfuscate } = require("javascript-obfuscator");

class NextJSObfuscatorPlugin {
  constructor(options, pluginOptions = {}) {
    // store obfuscator options
    this.options = Object.assign({}, options);

    // handle deprecated feature
    if(typeof pluginOptions === "function"){
      pluginOptions = {
        customHandler: pluginOptions,
      };
    }

    const { customHandler, customMatch, log } = pluginOptions;
    this.log = !!log;

    // concat default option
    const obfuscateFiles = Object.assign({}, {
      main: false,
      app: true,
      error: false,
      pages: false,
      webpack: true,
      framework: false,
      buildManifest: false,
      splittedChunks: false,
    }, pluginOptions.obfuscateFiles);

    // handle when boolean passed in pages option
    if(obfuscateFiles.pages === true){
      obfuscateFiles.pages = [".+"];
    }else if(obfuscateFiles.pages === false){
      obfuscateFiles.pages = [];
    }else if(!Array.isArray(obfuscateFiles.pages)){
      throw new Error("pages option must be boolean or array");
    }

    this.customHandler = customHandler || (assetPath => {
      if(!assetPath.endsWith(".js")) return false;
      if(customMatch && assetPath.match(customMatch)){
        return true;
      }
      const hashAndExt = "(-[a-zA-Z\\d]+)?\\.js";
      if([
        [obfuscateFiles.main, "static\\/chunks\\/main" + hashAndExt],
        [obfuscateFiles.app, "static\\/chunks\\/pages\\/_app" + hashAndExt],
        [obfuscateFiles.error, "static\\/chunks\\/pages\\/(_error|404|500)" + hashAndExt],
        ...obfuscateFiles.pages.map(page => [true, `static\\/chunks\\/pages\\/${page}${hashAndExt}`]),
        [obfuscateFiles.webpack, "static\\/chunks\\/webpack" + hashAndExt],
        [obfuscateFiles.framework, "static\\/chunks\\/framework" + hashAndExt],
        [obfuscateFiles.buildManifest, "static\\/[^/]+\\/_buildManifest\\.js"],
        [obfuscateFiles.splittedChunks, "static\\/chunks\\/\\d+" + hashAndExt],
      ].some(([condition, pattern, additional]) => {
        return condition && assetPath.match(new RegExp(`^${pattern}${additional || ""}$`, "g"));
      })){
        return true;
      }
      return false;
    });
  }

  apply (compiler) {
    const PluginName = this.constructor.name;
    compiler.hooks.compilation.tap(
      PluginName,
      (compilation) => {
        compilation.hooks.processAssets.tap({
          name: PluginName.slice(0, -6),
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
        }, (assets) => {
          const logger = compilation.getLogger && !this.log ? compilation.getLogger(PluginName) : console;

          logger.log("Initialized");
          const assetNames = Object.keys(assets);
          logger.log(assetNames);

          // obfuscate
          assetNames
            .filter(this.customHandler)
            .forEach(assetPath => {
              const asset = assets[assetPath];
              if(!asset) return;
              const source = asset.source();
              const options = (() => {
                if(assetPath.match(/^static\/chunks\/pages\//)){
                  const options = Object.assign({}, this.options, {
                    target: "node",
                  });
                  ["domainLock", "domainLockRedirectUrl"].forEach(key => {
                    if(options[key]){
                      delete options[key];
                    }
                  });
                  return options;
                }else{
                  return Object.assign({}, this.options, {
                    target: "browser",
                  });
                }
              })();
              const obfuscated = obfuscate(source, options).getObfuscatedCode();
              assets[assetPath] = new sources.RawSource(obfuscated);
              logger.log("Obfuscated: ", assetPath, "(" + asset.size() + "bytes", "->", obfuscated.length + "bytes,", "target:", options.target + ")");
            });
        });
      }
    )
  }
}

module.exports = NextJSObfuscatorPlugin;
