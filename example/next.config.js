const NextJSObfuscatorPlugin = require("nextjs-obfuscator");
const obfuscatorOptions = require("./obfuscator-options");

/** @type {import('next').NextConfig} */
module.exports = {
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
