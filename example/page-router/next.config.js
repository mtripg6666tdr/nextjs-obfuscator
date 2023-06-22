// @ts-check
const obfuscatorOptions = require("./obfuscator-options");
const withNextJSObfuscatorPlugin = require("../..")(obfuscatorOptions, {
  log: true,
  obfuscateFiles: {
    buildManifest: true,
    ssgManifest: true,
    webpack: true,
    additionalModules: ["es6-object-assign"],
  },
});

/** @type {import('next').NextConfig} */
module.exports = withNextJSObfuscatorPlugin({
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  }
});
