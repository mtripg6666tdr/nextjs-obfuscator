// @ts-check
const NextJSObfuscatorPlugin = require("..");
const obfuscatorOptions = require("./obfuscator-options");

/** @type {import('next').NextConfig} */
module.exports = {
  productionBrowserSourceMaps: true,
  webpack: (config, {dev}) => {
    if(!dev || true){
      config.plugins.push(
        // Define plugins
        new NextJSObfuscatorPlugin(obfuscatorOptions, {
          obfuscateFiles: {
            main: false,
            framework: false,

            app: true,

            error: false,
            pages: false,

            webpack: true,
            buildManifest: false,

            splittedChunks: false,
          },
          log: true,
        })
      );
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
