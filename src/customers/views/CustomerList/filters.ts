import { FilterElement } from "@dashboard/components/Filter";
import {
  CustomerFilterKeys,
  CustomerListFilterOpts,
} from "@dashboard/customers/components/CustomerListPage";
import { CustomerFilterInput } from "@dashboard/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
  GetFilterTabsOutput,
  getGteLteVariables,
  getMinMaxQueryParam,
} from "../../../utils/filters";
import {
  CustomerListUrlFilters,
  CustomerListUrlFiltersEnum,
  CustomerListUrlQueryParams,
} from "../../urls";

export const CUSTOMER_FILTERS_KEY = "customerFilters";

export function getFilterOpts(
  params: CustomerListUrlFilters,
): CustomerListFilterOpts {
  return {
    joined: {
      active:
        [params.joinedFrom, params.joinedTo].some(
          field => field !== undefined,
        ) ?? false,
      value: {
        max: params.joinedTo ?? "",
        min: params.joinedFrom ?? "",
      },
    },
    numberOfOrders: {
      active:
        [params.numberOfOrdersFrom, params.numberOfOrdersTo].some(
          field => field !== undefined,
        ) ?? false,
      value: {
        max: params.numberOfOrdersTo ?? "",
        min: params.numberOfOrdersFrom ?? "",
      },
    },
  };
}

export function getFilterVariables(
  params: CustomerListUrlFilters,
): CustomerFilterInput {
  return {
    dateJoined: getGteLteVariables({
      gte: params.joinedFrom,
      lte: params.joinedTo,
    }),
    numberOfOrders: getGteLteVariables({
      gte: params?.numberOfOrdersFrom
        ? parseInt(params.numberOfOrdersFrom, 10)
        : null,
      lte: params?.numberOfOrdersTo
        ? parseInt(params.numberOfOrdersTo, 10)
        : null,
    }),
    search: params.query,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<CustomerFilterKeys>,
): CustomerListUrlFilters {
  const { name } = filter;

  switch (name) {
    case CustomerFilterKeys.joined:
      return getMinMaxQueryParam(
        filter,
        CustomerListUrlFiltersEnum.joinedFrom,
        CustomerListUrlFiltersEnum.joinedTo,
      );

    case CustomerFilterKeys.numberOfOrders:
      return getMinMaxQueryParam(
        filter,
        CustomerListUrlFiltersEnum.numberOfOrdersFrom,
        CustomerListUrlFiltersEnum.numberOfOrdersTo,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(CUSTOMER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<CustomerListUrlQueryParams, CustomerListUrlFilters>(
    CustomerListUrlFiltersEnum,
  );

export const getPresetNameToDelete = (
  presets: GetFilterTabsOutput<string>,
  presetIdToDelete: number | null,
): string => {
  const presetIndex = presetIdToDelete ? presetIdToDelete - 1 : 0;
  const preset = presets?.[presetIndex];
  const tabName = preset?.name ?? "...";

  return tabName;
};
