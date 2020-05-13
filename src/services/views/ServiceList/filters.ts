import { IFilterElement } from "@saleor/components/Filter";
import { maybe, parseBoolean } from "@saleor/misc";
import {
  ServiceFilterKeys,
  ServiceListFilterOpts
} from "@saleor/services/components/ServiceListPage/filters";
import { ServiceAccountFilterInput } from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam
} from "../../../utils/filters";
import {
  ServiceListUrlFilters,
  ServiceListUrlFiltersEnum,
  ServiceListUrlQueryParams
} from "../../urls";

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
  const { name } = filter;

  switch (name) {
    case ServiceFilterKeys.active:
      return getSingleValueQueryParam(filter, ServiceListUrlFiltersEnum.active);
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
