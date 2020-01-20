import { CustomerFilterInput } from "@saleor/types/globalTypes";
import { maybe } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  CustomerFilterKeys,
  CustomerListFilterOpts
} from "@saleor/customers/components/CustomerListPage";
import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getMinMaxQueryParam
} from "../../../utils/filters";
import {
  CustomerListUrlFilters,
  CustomerListUrlFiltersEnum,
  CustomerListUrlQueryParams
} from "../../urls";

export const CUSTOMER_FILTERS_KEY = "customerFilters";

export function getFilterOpts(
  params: CustomerListUrlFilters
): CustomerListFilterOpts {
  return {
    joined: {
      active: maybe(
        () =>
          [params.joinedFrom, params.joinedTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.joinedTo, ""),
        min: maybe(() => params.joinedFrom, "")
      }
    },
    moneySpent: {
      active: maybe(
        () =>
          [params.moneySpentFrom, params.moneySpentTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.moneySpentTo, ""),
        min: maybe(() => params.moneySpentFrom, "")
      }
    },
    numberOfOrders: {
      active: maybe(
        () =>
          [params.numberOfOrdersFrom, params.numberOfOrdersTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.numberOfOrdersTo, ""),
        min: maybe(() => params.numberOfOrdersFrom, "")
      }
    }
  };
}

export function getFilterVariables(
  params: CustomerListUrlFilters
): CustomerFilterInput {
  return {
    dateJoined: getGteLteVariables({
      gte: params.joinedFrom,
      lte: params.joinedTo
    }),
    moneySpent: getGteLteVariables({
      gte: parseInt(params.moneySpentFrom, 0),
      lte: parseInt(params.moneySpentTo, 0)
    }),
    numberOfOrders: getGteLteVariables({
      gte: parseInt(params.numberOfOrdersFrom, 0),
      lte: parseInt(params.numberOfOrdersTo, 0)
    }),
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<CustomerFilterKeys>
): CustomerListUrlFilters {
  const { name } = filter;

  switch (name) {
    case CustomerFilterKeys.joined:
      return getMinMaxQueryParam(
        filter,
        CustomerListUrlFiltersEnum.joinedFrom,
        CustomerListUrlFiltersEnum.joinedTo
      );

    case CustomerFilterKeys.moneySpent:
      return getMinMaxQueryParam(
        filter,
        CustomerListUrlFiltersEnum.moneySpentFrom,
        CustomerListUrlFiltersEnum.moneySpentTo
      );

    case CustomerFilterKeys.numberOfOrders:
      return getMinMaxQueryParam(
        filter,
        CustomerListUrlFiltersEnum.numberOfOrdersFrom,
        CustomerListUrlFiltersEnum.numberOfOrdersTo
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<CustomerListUrlFilters>(CUSTOMER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  CustomerListUrlQueryParams,
  CustomerListUrlFilters
>(CustomerListUrlFiltersEnum);
