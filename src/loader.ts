import type { InternalNextjsObfuscatorOptions } from "./type";
import type { RawSourceMap } from "source-map";
import type webpack from "webpack";

import * as path from "path";
// import fs from "fs";

import { obfuscate } from "javascript-obfuscator";
import { transfer as transferSourceMap } from "multi-stage-sourcemap";

import { LoggerSymbol, PublicEnvVariablesSymbol } from "./type";

function loader(this: webpack.LoaderContext<InternalNextjsObfuscatorOptions>, source: string, map: RawSourceMap){
  const moduleRelativePath = path.relative(this.rootContext, this.resourcePath);
  const options = this.getOptions();
  const logger = options[LoggerSymbol];
  const publicEnvVariables = options[PublicEnvVariablesSymbol];
  const sourceMapRequired = options.sourceMap;

  const sortedEntries = Array.from(publicEnvVariables.entries())
        .sort(([keyA], [keyB]) => keyB.length - keyA.length);
    
  for (const [key, value] of sortedEntries){
      source = source.replaceAll(key, value);
  }

  const finalOptions = Object.assign(options, {
    ignoreRequireImports: true,
    inputFileName: moduleRelativePath,
    sourceMapMode: "separate",
  });

  // obfuscation
  const obfuscationResult = obfuscate(source, finalOptions);
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

  this.callback(null, obfuscated, sourceMap);
}

export = loader;
