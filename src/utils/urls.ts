import { getAppDefaultUri, getAppMountUri } from "@dashboard/config";
import { stringify } from "qs";

export function stringifyQs(
  params: unknown,
  arrayFormat?: "repeat" | "indices" | "brackets" | "comma",
): string {
  return stringify(params, {
    arrayFormat: arrayFormat || "indices",
  });
}

export function getArrayQueryParam(
  param: string | string[],
): string[] | undefined {
  if (!param) {
    return undefined;
  }

  if (Array.isArray(param)) {
    return param;
  }

  return [param];
}

export const isExternalURL = url => /^https?:\/\//.test(url);

export const getAppMountUriForRedirect = () =>
  getAppMountUri() === getAppDefaultUri() ? "" : getAppMountUri();
