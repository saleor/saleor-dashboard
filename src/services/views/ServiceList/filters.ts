import { ServiceAccountFilterInput } from "@saleor/types/globalTypes";
import {
  ServiceListFilterOpts,
  ServiceFilterKeys
} from "@saleor/services/components/ServiceListPage/filters";
import { maybe, parseBoolean } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  ServiceListUrlFilters,
  ServiceListUrlFiltersEnum,
  ServiceListUrlQueryParams
} from "../../urls";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";

export const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterOpts(
  params: ServiceListUrlFilters
): ServiceListFilterOpts {
  return {
    isActive: {
      active: maybe(() => params.active !== undefined, false),
      value:
        params.active !== undefined ? parseBoolean(params.active, true) : true
    }
  };
}

export function getFilterVariables(
  params: ServiceListUrlFilters
): ServiceAccountFilterInput {
  return {
    isActive:
      params.active !== undefined
        ? parseBoolean(params.active, true)
        : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ServiceFilterKeys>
): ServiceListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case ServiceFilterKeys.active:
      if (!active) {
        return {
          active: undefined
        };
      }
      return {
        active: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ServiceListUrlFilters>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ServiceListUrlQueryParams,
  ServiceListUrlFilters
>(ServiceListUrlFiltersEnum);
