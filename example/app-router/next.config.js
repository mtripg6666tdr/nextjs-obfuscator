const withNextjsObfuscator = require("../..")(
  require("../page-router/obfuscator-options"),
  {
    log: true,
    // writeConfig: true,
    obfuscateFiles: {
      buildManifest: true,
      ssgManifest: true,
      webpack: true,
      additionalModules: ["es6-object-assign"],
    },
  }
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_FOOBAR: "foobar",
  },
};

module.exports = withNextjsObfuscator(nextConfig);
