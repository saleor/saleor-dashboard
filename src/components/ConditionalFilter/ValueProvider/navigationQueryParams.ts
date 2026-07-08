import { parseQs } from "@dashboard/url-utils";
import { getArrayQueryParam } from "@dashboard/utils/urls";

import { type FilterProviderType } from "../types";

const ATTRIBUTE_LIST_NAVIGATION_QUERY_KEYS = ["typeIds", "pageTypes"] as const;

export const stripNavigationQueryParams = (
  params: URLSearchParams,
  providerType: FilterProviderType,
): void => {
  if (providerType !== "attributes") {
    return;
  }

  [...params.keys()].forEach(key => {
    const isNavigationKey = ATTRIBUTE_LIST_NAVIGATION_QUERY_KEYS.some(
      name => key === name || key.startsWith(`${name}[`),
    );

    if (isNavigationKey) {
      params.delete(key);
    }
  });
};

const readNavigationTypeIds = (
  locationSearch: string,
): { typeIds?: string[]; pageTypes?: string[] } => {
  const qs = parseQs(locationSearch.startsWith("?") ? locationSearch.slice(1) : locationSearch);
  const typeIdsParam = qs.typeIds;

  if (typeIdsParam !== undefined && typeIdsParam !== null) {
    const typeIds = getArrayQueryParam(typeIdsParam as string | string[]);

    return typeIds?.length ? { typeIds } : {};
  }

  const pageTypesParam = qs.pageTypes;

  if (pageTypesParam === undefined || pageTypesParam === null) {
    return {};
  }

  const pageTypes = getArrayQueryParam(pageTypesParam as string | string[]);

  return pageTypes?.length ? { pageTypes } : {};
};

export const getAttributeListNavigationQueryParams = (
  locationSearch: string,
): { typeIds?: string[]; pageTypes?: string[] } => readNavigationTypeIds(locationSearch);
