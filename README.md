# javascript-obfuscator plugin for Next.js
[![npm](https://img.shields.io/npm/v/nextjs-obfuscator)](https://www.npmjs.com/package/nextjs-obfuscator)
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
Some options can break your app so you should check your app works fine before deploying it.  
> **Note**  
> `disableConsoleOutput` should be set to `false` because this option may prevent you from finding that your app has been broken.
### `pluginOptions`
Type: `Object` (optional)  
More options for this plugin.
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
    pages: boolean|string[],
    webpack: boolean,
    framework: boolean,
    buildManifest: boolean,
  },
  /**
   * set whether the plugin logs to console
   * This can be useful in case that you want to know what files are passed to this plugin on compilation and to set some additional files to be obfuscated.
   * Default: false
   */
  log:boolean,
}
```
In the default, only the `_app.tsx`(or `_app.jsx`) and the webpack entry point will be obfuscated. Obfuscating other scripts can break your app.   
> For compatibility with v1.0.0, `pluginOptions` can receive a function, not only an object.

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
  According to my experiments, obfuscating these files will break nextjs apps, however you can enable these options at your own risks if you see this doesn't break.  
  `pages` can also receive regex strings array to determine which files to be obfuscated. for example:
  ```js
  {
    pages: [
      "index",
      "a\\/b",
    ]
  }
  ```
  - Default: `false`

- `webpack`, `buildManifest`  
  The `webpack` is the entry point of webpack.  
  The `buildManifest` is the build manifest file which contains information of your whole app.  
  According to my experiments, obfuscating both of these two files will break your app.  
  You can enable only one of these two as needed basis.
  - Default: 
    - `webpack`: `true`
    - `buildManifest`: `false`

## Disclaimer
Again, using this plugin can break your nextjs app so you SHOULD check carefully your app works fine.

## License
[LICENSE](LICENSE)
