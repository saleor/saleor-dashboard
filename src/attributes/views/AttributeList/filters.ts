import {
  AttributeFilterKeys,
  AttributeListFilterOpts,
} from "@saleor/attributes/components/AttributeListPage";
import { FilterElement } from "@saleor/components/Filter";
import { AttributeFilterInput } from "@saleor/graphql";
import { maybe, parseBoolean } from "@saleor/misc";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  AttributeListUrlFilters,
  AttributeListUrlFiltersEnum,
  AttributeListUrlQueryParams,
} from "../../urls";

export const ATTRIBUTE_FILTERS_KEY = "attributeFilters";

export function getFilterOpts(
  params: AttributeListUrlFilters,
): AttributeListFilterOpts {
  return {
    filterableInStorefront: {
      active: params.filterableInStorefront !== undefined,
      value: maybe(() => parseBoolean(params.filterableInStorefront, true)),
    },
    isVariantOnly: {
      active: params.isVariantOnly !== undefined,
      value: maybe(() => parseBoolean(params.isVariantOnly, true)),
    },
    valueRequired: {
      active: params.valueRequired !== undefined,
      value: maybe(() => parseBoolean(params.valueRequired, true)),
    },
    visibleInStorefront: {
      active: params.visibleInStorefront !== undefined,
      value: maybe(() => parseBoolean(params.visibleInStorefront, true)),
    },
  };
}

export function getFilterVariables(
  params: AttributeListUrlFilters,
): AttributeFilterInput {
  return {
    filterableInStorefront:
      params.filterableInStorefront !== undefined
        ? parseBoolean(params.filterableInStorefront, false)
        : undefined,
    isVariantOnly:
      params.isVariantOnly !== undefined
        ? parseBoolean(params.isVariantOnly, false)
        : undefined,
    search: params.query,
    valueRequired:
      params.valueRequired !== undefined
        ? parseBoolean(params.valueRequired, false)
        : undefined,
    visibleInStorefront:
      params.visibleInStorefront !== undefined
        ? parseBoolean(params.visibleInStorefront, false)
        : undefined,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<AttributeFilterKeys>,
): AttributeListUrlFilters {
  const { name } = filter;

  switch (name) {
    case AttributeFilterKeys.filterableInStorefront:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.filterableInStorefront,
      );

    case AttributeFilterKeys.isVariantOnly:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.isVariantOnly,
      );

    case AttributeFilterKeys.valueRequired:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.valueRequired,
      );

    case AttributeFilterKeys.visibleInStorefront:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.visibleInStorefront,
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<AttributeListUrlFilters>(ATTRIBUTE_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<AttributeListUrlQueryParams, AttributeListUrlFilters>(
  AttributeListUrlFiltersEnum,
);
