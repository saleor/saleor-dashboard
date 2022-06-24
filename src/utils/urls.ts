import isArray from "lodash/isArray";
import { stringify } from "qs";

export function stringifyQs(params: {}): string {
  return stringify(params, {
    arrayFormat: "indices",
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

export const isExternalURL = url => /^https?:\/\//.test(url);
