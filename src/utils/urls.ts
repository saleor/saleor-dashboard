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

/**
 * Build a url, omitting the query string entirely when there are no params.
 * A bare trailing "?" is not just cosmetic: url helpers are sometimes passed as
 * `LocationDescriptor.pathname`, where it ends up inside the path and a later
 * dialog navigation appends a second "?", making the query unparseable.
 */
export function withQuery(path: string, params?: unknown): string {
  const query = stringifyQs(params);

  return query ? `${path}?${query}` : path;
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
