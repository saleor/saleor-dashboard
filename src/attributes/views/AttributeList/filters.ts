import { AttributeFilterInput } from "@saleor/types/globalTypes";
import { maybe, parseBoolean } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  AttributeListFilterOpts,
  AttributeFilterKeys
} from "@saleor/attributes/components/AttributeListPage";
import {
  createFilterTabUtils,
  createFilterUtils
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
  const { active, name, value } = filter;

  switch (name) {
    case AttributeFilterKeys.availableInGrid:
      if (!active) {
        return {
          availableInGrid: undefined
        };
      }

      return {
        availableInGrid: value[0]
      };

    case AttributeFilterKeys.filterableInDashboard:
      if (!active) {
        return {
          filterableInDashboard: undefined
        };
      }

      return {
        filterableInDashboard: value[0]
      };

    case AttributeFilterKeys.filterableInStorefront:
      if (!active) {
        return {
          filterableInStorefront: undefined
        };
      }

      return {
        filterableInStorefront: value[0]
      };

    case AttributeFilterKeys.isVariantOnly:
      if (!active) {
        return {
          isVariantOnly: undefined
        };
      }

      return {
        isVariantOnly: value[0]
      };

    case AttributeFilterKeys.valueRequired:
      if (!active) {
        return {
          valueRequired: undefined
        };
      }

      return {
        valueRequired: value[0]
      };

    case AttributeFilterKeys.visibleInStorefront:
      if (!active) {
        return {
          visibleInStorefront: undefined
        };
      }

      return {
        visibleInStorefront: value[0]
      };
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
