import { AttributeFilterInput } from "@saleor/types/globalTypes";
import { maybe, parseBoolean } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  AttributeListFilterOpts,
  AttributeFilterKeys
} from "@saleor/attributes/components/AttributeListPage";
import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam
} from "../../../utils/filters";
import {
  AttributeListUrlFilters,
  AttributeListUrlFiltersEnum,
  AttributeListUrlQueryParams
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterOpts(
  params: AttributeListUrlFilters
): AttributeListFilterOpts {
  return {
    availableInGrid: {
      active: params.availableInGrid !== undefined,
      value: maybe(() => parseBoolean(params.availableInGrid, true))
    },
    filterableInDashboard: {
      active: params.filterableInDashboard !== undefined,
      value: maybe(() => parseBoolean(params.filterableInDashboard, true))
    },
    filterableInStorefront: {
      active: params.filterableInStorefront !== undefined,
      value: maybe(() => parseBoolean(params.filterableInStorefront, true))
    },
    isVariantOnly: {
      active: params.isVariantOnly !== undefined,
      value: maybe(() => parseBoolean(params.isVariantOnly, true))
    },
    valueRequired: {
      active: params.valueRequired !== undefined,
      value: maybe(() => parseBoolean(params.valueRequired, true))
    },
    visibleInStorefront: {
      active: params.visibleInStorefront !== undefined,
      value: maybe(() => parseBoolean(params.visibleInStorefront, true))
    }
  };
}

export function getFilterVariables(
  params: AttributeListUrlFilters
): AttributeFilterInput {
  return {
    availableInGrid:
      params.availableInGrid !== undefined
        ? parseBoolean(params.availableInGrid, false)
        : undefined,
    filterableInDashboard:
      params.filterableInDashboard !== undefined
        ? parseBoolean(params.filterableInDashboard, false)
        : undefined,
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
        : undefined
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<AttributeFilterKeys>
): AttributeListUrlFilters {
  const { name } = filter;

  switch (name) {
    case AttributeFilterKeys.availableInGrid:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.availableInGrid
      );

    case AttributeFilterKeys.filterableInDashboard:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.filterableInDashboard
      );

    case AttributeFilterKeys.filterableInStorefront:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.filterableInStorefront
      );

    case AttributeFilterKeys.isVariantOnly:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.isVariantOnly
      );

    case AttributeFilterKeys.valueRequired:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.valueRequired
      );

    case AttributeFilterKeys.visibleInStorefront:
      return getSingleValueQueryParam(
        filter,
        AttributeListUrlFiltersEnum.visibleInStorefront
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<AttributeListUrlFilters>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  AttributeListUrlQueryParams,
  AttributeListUrlFilters
>(AttributeListUrlFiltersEnum);
