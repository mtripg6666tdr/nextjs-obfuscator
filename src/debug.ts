import fs from "fs";

export function writeDownWebpackConfig(config: any){
  const stringified = JSON.stringify(config, jsonStringifyReplacer, "  ");

  fs.writeFileSync(`./webpack-config-${Date.now()}.temp.json`, stringified);
}

function jsonStringifyReplacer(_key: string, value: any){
  if(value instanceof RegExp){
    return { "[__type]": "RegExp", value: value.toString() };
  }else if(typeof value === "bigint"){
    return { "[__type": "BigInt", value: value.toString() };
  }

  return value;
}
