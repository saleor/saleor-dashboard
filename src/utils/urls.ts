import { stringify } from "qs";
import isArray from "lodash-es/isArray";

export function stringifyQs(params: object): string {
  return stringify(params, {
    indices: false
  });
}

export function getArrayQueryParam(param: string | string[]): string[] {
  if (!param) {
    return undefined;
  }

  if (isArray(param)) {
    return param;
  }

  return [param];
}
