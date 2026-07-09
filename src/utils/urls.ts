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
  param: string | string[] | Record<string, string> | undefined,
): string[] | undefined {
  if (!param) {
    return undefined;
  }

  if (Array.isArray(param)) {
    return param.filter(Boolean);
  }

  if (typeof param === "object") {
    const values = Object.values(param).filter(Boolean);

    return values.length ? values : undefined;
  }

  return [param];
}

export const isExternalURL = (url: string) => /^https?:\/\//.test(url);

export const getAppMountUriForRedirect = () =>
  getAppMountUri() === getAppDefaultUri() ? "" : getAppMountUri();

export const getMultipleUrlValues = (urlSearch: string, fieldName: string): string[] => {
  const params = new URLSearchParams(urlSearch);

  return params.getAll(fieldName);
};
