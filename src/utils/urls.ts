import { getAppDefaultUri, getAppMountUri } from "@saleor/config";
import isArray from "lodash/isArray";
import { stringify } from "qs";

export function stringifyQs(params: unknown, arrayFormat?: string): string {
  return stringify(params, {
    arrayFormat: arrayFormat || "indices",
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

export const getAppMountUriForRedirect = () =>
  getAppMountUri() === getAppDefaultUri() ? "" : getAppMountUri();
