import type { ObfuscatorOptions } from "javascript-obfuscator";

type OmitKeys<T, U extends string> = T & { [key in U]: never };

export type PluginOptions = {
  enabled: boolean | "detect",
  /**
   * determines which files to be obfuscated
   */
  patterns: string[],
  /**
   * Additional files to be obfuscated
   */
  obfuscateFiles: Partial<{
    buildManifest: boolean,
    ssgManifest: boolean,
    webpack: boolean,
    additionalModules: string[],
  }>,
  /**
   * indicates whether the plugin logs to console
   */
  log: boolean,
};

export type ObjectWithUnconstantString<T extends Record<any, any>> = {
  [key in keyof T]: Required<T>[key] extends string
    ? string
    : Required<T>[key] extends number
      ? number
      : Required<T>[key] extends string[]
        ? string[]
        : Required<T>[key] extends number[]
          ? number[]
          : Required<T>[key] extends Record<any, any>
            ? Partial<ObjectWithUnconstantString<T[key]>>
            : T[key]
};

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
