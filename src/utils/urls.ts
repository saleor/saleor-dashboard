import isArray from "lodash-es/isArray";
import { stringify } from "qs";

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
