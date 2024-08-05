import type { ObfuscatorOptions } from "javascript-obfuscator";

type OmitKeys<T, U extends string> = T & { [key in U]: never };

export type NextjsObfuscatorOptions = OmitKeys<
ObfuscatorOptions,
  | "inputFileName"
  | "sourceMapBaseUrl"
  | "sourceMapFileName"
  | "sourceMapMode"
  | "sourceMapSourcesMode"
>;

export const LoggerSymbol = Symbol("NextJsObfuscatorLogger");
export const PublicEnvVariablesSymbol = Symbol("NextJsObfuscatorPublicEnvVariables");

export type InternalNextjsObfuscatorOptions = NextjsObfuscatorOptions & {
  [LoggerSymbol]: (...messages: any[]) => void,
  [PublicEnvVariablesSymbol]: Map<string, string>,
};
