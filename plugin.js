const { Compilation, sources } = require("webpack");
const { obfuscate } = require("javascript-obfuscator");

class NextJSObfuscatorPlugin {
  constructor(options, customHandler) {
    this.options = options;
    this.customHandler = customHandler || (assetPath => assetPath.startsWith("static/chunks/webpack") && assetPath.endsWith(".js"));
  }

  apply (compiler) {
    const PluginName = this.constructor.name;
    compiler.hooks.compilation.tap(
      PluginName,
      (compilation) => {
        compilation.hooks.processAssets.tap({
          name: "NextJSObfuscator",
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
        }, (assets) => {
          const logger = compilation.getLogger ? compilation.getLogger(PluginName) : console;
          Object.keys(assets)
            .filter(this.customHandler)
            .forEach(assetPath => {
              const asset = assets[assetPath];
              if(!asset) return;
              const source = asset.source();
              const obfuscated = obfuscate(source, this.options).getObfuscatedCode();
              assets[assetPath] = new sources.RawSource(obfuscated);
              logger.log("Obfuscated: ", assetPath, "(" + asset.size(), "->", obfuscated.length + ")");
            });
        });
      }
    )
  }
}

module.exports = NextJSObfuscatorPlugin;