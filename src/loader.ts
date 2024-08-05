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

  // Workaround for public environmen variables
  const envVariableRandomString = generateRandomString();
  const envVariablesMap = new Map<string, string>();
  source = source.replace(/process\.env\.NEXT_PUBLIC_([\w_-]+)/g, (match, envVariableName) => {
    const replacedIdentifer = `___njso_${envVariableRandomString}_${envVariableName}___`;
    envVariablesMap.set(replacedIdentifer, match);
    logger(`Found public environment variable: ${envVariableName} -> ${replacedIdentifer}`);
    return replacedIdentifer;
  });

  const finalOptions = Object.assign(options, {
    ignoreRequireImports: true,
    inputFileName: moduleRelativePath,
    sourceMapMode: "separate",
    reservedNames: (options.reservedNames ?? []).concat(Array.from(envVariablesMap.keys())),
  });

  // obfuscation
  const obfuscationResult = obfuscate(source, finalOptions);
  let obfuscated = obfuscationResult.getObfuscatedCode();

  // Restore public environment variables
  if(envVariablesMap.size !== 0){
    logger("Restoring public environment variables");
    for(const [replacedIdentifer, originalIdentifer] of envVariablesMap){
      obfuscated = obfuscated.replaceAll(replacedIdentifer, originalIdentifer);
    }
  }

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

function generateRandomString(){
  return Math.random()
    .toString(36)
    .substring(7);
}

export = loader;
