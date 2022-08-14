# javascript-obfuscator plugin for Next.js
## Installation
```
npm i javascript-obfuscator nextjs-obfuscator -D
```
## Usage
Write in your `next.config.js` to inject this plugin, for example:
```js
const NextJSObfuscatorPlugin = require("nextjs-obfuscator");
module.exports = {
  webpack: (config, {dev}) => {
    if(!dev){
      config.plugins.push(new NextJSObfuscatorPlugin({
        // ...your config
      }))
    }

    return config;
  }
}
```
## API
`new NextJSObfuscatorPlugin(obfuscatorOptions, pluginOptions)`
### `obfuscatorOptions`
Type: `Object` (required)  
This is the options of [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).  
Some options can break your app (for example: `splitStrings`). Please check your app works fine before deploying it.  
In addition to that, you should set `disableConsoleOutput` to `false` because this option may prevent you from noticing that your app has been broken.
### `pluginOptions`
Type: `Object` (optional)  
More options.
```ts
{
  /**
   * This handler determines which chunks will be obfuscated. We do not recommend to use this arg.  
   * @deprecated this option is for compatiblity with v1.0.0
   */
  customHandler:customHandler,
  /**
   * a custom regular expression to be used to obfuscate custom files
   */
  customMatch:RegExp,
  /**
   * determines which files to be obfuscated
   * See below for more details
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
   * Default: false
   */
  log:boolean,
}
```
In the default, only webpack entry point and `_app` will be obfuscated. Obfuscating other scripts may break your app. 

### `obfuscateFiles`
- `main`, `framework`  
  These files are from various libraries such as `react` or `react-dom`.  
  Generally these files should NOT be obfuscated.  
  - Default: `false`  

- `app`  
  This is from `_app.tsx` or `_app.jsx`.  
  According to our experiments, app will be fine even if you obfuscate this file.  
  You may set this to true as needed basis.
  - Default: `false`  

- `error`, `pages`  
  These files are from `pages` directory.  
  According to our experiments, obfuscating these files will break your app. However even if obfuscating these files might not break your app depending on your obfuscate options and content of your app.  
  - Default: `false`

- `webpack`, `buildManifest`  
  The `webpack` is the entry point of webpack.  
  The `buildManifest` is the build manifest file which contains information of your whole app.  
  According to our experiments, obfuscating both of these two files will break your app.  
  You can enable only one of these two as needed basis.
  - Default: 
    - `webpack`: `true`
    - `buildManifest`: `false`

## Disclaimer
Using this package might break your app. You have to check your app works fine before deploying it.

## License
[LICENSE](LICENSE)