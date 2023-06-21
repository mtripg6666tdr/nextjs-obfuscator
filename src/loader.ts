import type webpack from "webpack";
import { InternalNextjsObfuscatorOptions, LoggerSymbol } from "./type";
import type { RawSourceMap } from "source-map";
import * as path from "path";
import { obfuscate } from "javascript-obfuscator";
import { transfer as transferSourceMap } from "multi-stage-sourcemap";

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

  let sourceMap: string | undefined = undefined;
  if(sourceMapRequired){
    sourceMap = transferSourceMap({
      fromSourceMap: obfuscationResult.getSourceMap(),
      toSourceMap: map,
    });
  }

  this.callback(null, obfuscated, sourceMap);
}

export = loader;
