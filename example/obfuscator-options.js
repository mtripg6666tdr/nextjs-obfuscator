// @ts-check

/** @type {import("javascript-obfuscator").ObfuscatorOptions} */
module.exports = {
  compact: true,
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0.75,
  disableConsoleOutput: false,
  domainLock: [
    ".usamyon.moe",
    "localhost",
  ],
  domainLockRedirectUrl: "about:blank",
  identifierNamesCache: null,
  identifierNamesGenerator: "mangled",
  optionsPreset: "low-obfuscation",
  rotateStringArray: true,
  seed: 0,
  selfDefending: true,
  shuffleStringArray: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayIndexesType: [
    "hexadecimal-number"
  ],
  target: "browser",
}
