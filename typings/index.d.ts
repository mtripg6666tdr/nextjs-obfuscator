declare module "nextjs-obfuscator" {
  import type { ObfuscatorOptions } from "javascript-obfuscator";
  type customHandler = (path:string)=>boolean;
  type pluginOptions = {
    /**
     * This handler determines which chunks will be obfuscated or not. We do not recommend to use this arg.  
     * @deprecated this option is for compatiblity witch v1.0.0
     */
    customHandler:customHandler,
    /**
     * custom regular expression to be used to obfuscate custom files
     */
    customMatch:RegExp,
    /**
     * determines which files to be obfuscated
     */
    obfuscateFiles:{
      main: boolean,
      app: boolean,
      error: boolean,
      pages: boolean,
      webpack: boolean,
      framework: boolean,
      buildManifest: boolean,
    },
    /**
     * indicates whether the plugin logs to console
     */
    log:boolean,
  };
  class NextJSBundleObfuscatorPlugin {
    /**
     * initialize plugin
     * @param options options that will be passed to javascript-obfuscator
     * @param pluginOptions Plugin options that determines, which files to be obfuscated, and so on
     */
    constructor(options:ObfuscatorOptions, pluginOptions?:pluginOptions);
    /**
     * @deprecated
     */
    constructor(options:ObfuscatorOptions, customHandler?:customHandler);
    /**
     * @internal
     */
    apply(compiler:any):void;
  }
  export = NextJSBundleObfuscatorPlugin;
}