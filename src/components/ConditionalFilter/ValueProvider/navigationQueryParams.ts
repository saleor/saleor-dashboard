import { parseQs } from "@dashboard/url-utils";
import { getArrayQueryParam } from "@dashboard/utils/urls";

import { type FilterProviderType } from "../types";

const NAVIGATION_QUERY_KEYS_BY_PROVIDER: Partial<Record<FilterProviderType, readonly string[]>> = {
  attributes: ["typeIds", "pageTypes"],
  customer: ["customerTypes"],
};

const isNavigationQueryKey = (key: string, names: readonly string[]): boolean =>
  names.some(name => key === name || key.startsWith(`${name}[`));

export const stripNavigationQueryParams = (
  params: URLSearchParams,
  providerType: FilterProviderType,
): void => {
  const names = NAVIGATION_QUERY_KEYS_BY_PROVIDER[providerType];

  if (!names) {
    return;
  }

  [...params.keys()].forEach(key => {
    if (isNavigationQueryKey(key, names)) {
      params.delete(key);
    }
  });
};

const readArrayQueryParam = (qs: Record<string, unknown>, name: string): string[] | undefined => {
  const param = qs[name];

  if (param === undefined || param === null) {
    return undefined;
  }

  const values = getArrayQueryParam(param as string | string[] | Record<string, string>);

  return values?.length ? values : undefined;
};

const readNavigationTypeIds = (
  locationSearch: string,
): { typeIds?: string[]; pageTypes?: string[] } => {
  const qs = parseQs(locationSearch.startsWith("?") ? locationSearch.slice(1) : locationSearch);
  const typeIds = readArrayQueryParam(qs, "typeIds");

  if (typeIds) {
    return { typeIds };
  }

  const pageTypes = readArrayQueryParam(qs, "pageTypes");

  return pageTypes ? { pageTypes } : {};
};

export const getAttributeListNavigationQueryParams = (
  locationSearch: string,
): { typeIds?: string[]; pageTypes?: string[] } => readNavigationTypeIds(locationSearch);

export const getNavigationQueryParams = (
  locationSearch: string,
  providerType: FilterProviderType,
): Record<string, string[]> => {
  if (providerType === "attributes") {
    return getAttributeListNavigationQueryParams(locationSearch);
  }

  const names = NAVIGATION_QUERY_KEYS_BY_PROVIDER[providerType];

  if (!names) {
    return {};
  }

  const qs = parseQs(locationSearch.startsWith("?") ? locationSearch.slice(1) : locationSearch);
  const result: Record<string, string[]> = {};

  names.forEach(name => {
    const values = readArrayQueryParam(qs, name);

    if (values) {
      result[name] = values;
    }
  });

  return result;
};
