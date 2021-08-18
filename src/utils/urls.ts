import isArray from "lodash/isArray";
import { stringify } from "qs";

export function stringifyQs(params: {}): string {
  return stringify(params, {
    indices: false,
    arrayFormat: "brackets"
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
