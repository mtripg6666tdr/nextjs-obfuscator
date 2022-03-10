declare module "nextjs-obfuscator" {
  import { ObfuscatorOptions } from "javascript-obfuscator";
  type customHandler = (path:string)=>boolean;
  class NextJSBundleObfuscatorPlugin {
    constructor(options:ObfuscatorOptions, customHandler:customHandler);
    apply(compiler:any):void;
  }
  export = NextJSBundleObfuscatorPlugin;
}