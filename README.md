# javascript-obfuscator plugin for Next.js
[![npm](https://img.shields.io/npm/v/nextjs-obfuscator)](https://www.npmjs.com/package/nextjs-obfuscator)

The `nextjs-obfuscator` enables you to make your Next.js app difficult to be reverse-engineered, using [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).

### ℹ️ If you are looking for README for v1, see [here](https://github.com/mtripg6666tdr/nextjs-obfuscator/tree/v1#readme).

There are some useful notes:
- The app router is supported.
- Building by turbopack is currently NOT supported.
- Minimum supported Next.js version is v13.

## Installation
You have to install javascript-obfuscator separately.

On npm:
```
npm i -D javascript-obfuscator nextjs-obfuscator
```
On yarn:
```
yarn add -D javascript-obfuscator nextjs-obfuscator
```

## Usage
Wrap your configuration in your `next.config.js` to use this plugin, for example:
```js
const withNextJsObfuscator = require("nextjs-obfuscator")(obfuscatorOptions, pluginOptions);

/** @type {import("next").NextConfig} */
const nextConfig = withNextJsObfuscator({
  // ... your next.js configuration
});

module.exports = nextConfig;
```
Or if you use `next.config.mjs`:
```js
import createNextJsObfuscator from "nextjs-obfuscator";

const withNextJsObfuscator = createNextJsObfuscator(obfuscatorOptions, pluginOptions);

/** @type {import("next").NextConfig} */
const nextConfig = withNextJsObfuscator({
  // ... your next.js configuration
});

export default nextConfig;
```

## API
<pre>
require("nextjs-obfuscator")(<a href="#obfuscatoroptions">obfuscatorOptions</a>, <a href="#pluginoptions">pluginOptions</a>)
</pre>
### `obfuscatorOptions`
Type: `Object` (required)  
This is [the options](https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options) of [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator), but there are some important notes:  
* [`disableConsoleOutput`](https://github.com/javascript-obfuscator/javascript-obfuscator#disableconsoleoutput) should be set to `false` and you can easily notice the error logging by React on console. If they are present, they indicate your app has been broken.
* There are some options that MUST NOT be set:
  * [`inputFileName`](https://github.com/javascript-obfuscator/javascript-obfuscator#inputfilename)
  * [`sourceMapBaseUrl`](https://github.com/javascript-obfuscator/javascript-obfuscator#sourcemapbaseurl)
  * [`sourceMapFileName`](https://github.com/javascript-obfuscator/javascript-obfuscator#sourcemapfilename)
  * [`sourceMapMode`](https://github.com/javascript-obfuscator/javascript-obfuscator#sourcemapmode)
  * [`sourceMapSourcesMode`](https://github.com/javascript-obfuscator/javascript-obfuscator#sourcemapsourcesmode)
  
  These options will be set by the nextjs-obfuscator plugin internally if necessary.

### `pluginOptions`
Type: `Object` (optional)  
More options for this plugin. All properties are optional.
```ts
{
  enabled: boolean | "detect",
  patterns: string[],
  obfuscateFiles: Partial<{
    buildManifest: boolean,
    ssgManifest: boolean,
    webpack: boolean,
    additionalModules: string[],
  }>,
  log: boolean,
};
```

|Option   |Type                                |Default Value|Description|
|---------|------------------------------------|-------------|-----------|
|`enabled`|<code>boolean &#124; "detect"</code>|`"detect"`|Indicates if the plugin is enabled or not.<br/>If `"detect"` specified, the plugin will be enabled only when building for production.|
|`patterns`|`string[]`|<code>["./**/*.(js&#124;jsx&#124;ts&#124;tsx)"]</code>|Glob patterns to determine which files to be obfuscated. They must be relative paths from the directory where `next.config.js` is placed.|
|`obfuscateFiles`|`object`||Additional files to be obfuscated.|
|`obfuscateFiles.buildManifest`|`boolean`|`false`|If set to true, the plugin will obfuscate `_buildManifest.js`|
|`obfuscateFiles.ssgManifest`|`boolean`|`false`|If set to true, the plugin will obfuscate `_ssgManifest.js`|
|`obfuscateFiles.webpack`|`boolean`|`false`|If set to true, the plugin will obfuscate `webpack.js`, which is an entry point.|
|`obfuscateFiles.additionalModules`|`string[]`|`[]`|Names of additional external modules to be obfuscated. Convenient if you are using custom npm package, for instance. Use like `["module-a", "module-b", ...]`.|
|`log`|`boolean`|`false`|If set to true, the plugin will use `console.log` as logger. Otherwise, it uses webpack's standard logger.|

## How it works
* This plugin inserts a custom loader to obfuscate project files and external modules.
* This plugin inserts a custom plugin to obfuscate `buildManifest`, `ssgManifest`, `webpack` assets.

## Disclaimer
Using this plugin can break your next.js app, so you have to check carefully your app works fine.

## License
[LICENSE](LICENSE)
