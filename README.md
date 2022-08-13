# javascript-obfuscator plugin for Next.js
## Installation
```
npm i javascript-obfuscator nextjs-obfuscator -D
```
## Usage
Write in your `next.config.js` to inject this plugin, for example:
```js
const NextJSBundleObfuscatorPlugin = require("nextjs-obfuscator");
module.exports = {
  webpack: (config, {dev}) => {
    if(!dev){
      config.plugins.push(new NextJSBundleObfuscatorPlugin({
        // ...your config
      }))
    }

    return config;
  }
}
```
## API
`new NextJSBundleObfuscatorPlugin(obfuscatorOptions, customHandler)`
### `obfuscatorOptions`
Type: `Object` (required)  
This is the options of [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).  
Some options can break your app (for example: `splitStrings`). Please check your app works fine before deploying it.  
### `customHandler`
Type: `Function ((path:string)=>boolean)` (optional)  
This handler determines chunk is to be obfuscated or not. We do not recommend to use this arg.  
In the default, only webpack entry point will be obfuscated. Obfuscating other scripts may break your app.  

## License
[LICENSE](LICENSE)