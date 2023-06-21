import { ObfuscatorOptions } from "javascript-obfuscator";

type OmitKeys<T, U extends string> = T & { [key in U]: never };

export type NextjsObfuscatorOptions = OmitKeys<
  ObfuscatorOptions,
  | "inputFileName"
  | "sourceMapBaseUrl"
  | "sourceMapFileName"
  | "sourceMapMode"
  | "sourceMapSourcesMode"
>;

export const LoggerSymbol = Symbol.for("NextJsObfuscatorLogger");

export type InternalNextjsObfuscatorOptions = NextjsObfuscatorOptions & {
  [LoggerSymbol]: (...messages: any[]) => void;
}
