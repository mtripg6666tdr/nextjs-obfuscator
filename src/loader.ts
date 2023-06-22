import type { InternalNextjsObfuscatorOptions } from "./type";
import type { RawSourceMap } from "source-map";
import type webpack from "webpack";

import * as path from "path";
// import fs from "fs";

import { obfuscate } from "javascript-obfuscator";
import { transfer as transferSourceMap } from "multi-stage-sourcemap";

import { LoggerSymbol } from "./type";

function loader(this: webpack.LoaderContext<InternalNextjsObfuscatorOptions>, source: string, map: RawSourceMap){
  const moduleRelativePath = path.relative(this.rootContext, this.resourcePath);

  const options = this.getOptions();

  const logger = options[LoggerSymbol] as ((...messages: any[]) => void);

  const sourceMapRequired = options.sourceMap;
  const obfuscationResult = obfuscate(
    source,
    Object.assign(options, {
      ignoreRequireImports: true,
      inputFileName: moduleRelativePath,
      sourceMapMode: "separate",
    }),
  );
  const obfuscated = obfuscationResult.getObfuscatedCode();

  logger("Obfuscated:", moduleRelativePath, source.length, "->", obfuscated.length);

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let sourceMap: string | undefined;
  if(map && sourceMapRequired){
    sourceMap = transferSourceMap({
      fromSourceMap: obfuscationResult.getSourceMap(),
      toSourceMap: map,
    });
  }

  // const now = Date.now();
  // fs.writeFileSync(`./${now}.pre.js`, source);
  // map && fs.writeFileSync(`./${now}.pre.js.map`, JSON.stringify(map));
  // fs.writeFileSync(`./${now}.post.js`, obfuscated);
  // sourceMap && fs.writeFileSync(`./${now}.post.js.map`, sourceMap);

  this.callback(null, obfuscated, sourceMap);
}

export = loader;
