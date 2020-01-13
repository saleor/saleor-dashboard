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
  getGteLteVariables
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
  const { active, multiple, name, value } = filter;

  switch (name) {
    case CustomerFilterKeys.joined:
      if (!active) {
        return {
          joinedFrom: undefined,
          joinedTo: undefined
        };
      }
      if (multiple) {
        return {
          joinedFrom: value[0],
          joinedTo: value[1]
        };
      }

      return {
        joinedFrom: value[0],
        joinedTo: value[0]
      };

    case CustomerFilterKeys.moneySpent:
      if (!active) {
        return {
          moneySpentFrom: undefined,
          moneySpentTo: undefined
        };
      }
      if (multiple) {
        return {
          moneySpentFrom: value[0],
          moneySpentTo: value[1]
        };
      }

      return {
        moneySpentFrom: value[0],
        moneySpentTo: value[0]
      };

    case CustomerFilterKeys.numberOfOrders:
      if (!active) {
        return {
          numberOfOrdersFrom: undefined,
          numberOfOrdersTo: undefined
        };
      }
      if (multiple) {
        return {
          numberOfOrdersFrom: value[0],
          numberOfOrdersTo: value[1]
        };
      }

      return {
        numberOfOrdersFrom: value[0],
        numberOfOrdersTo: value[0]
      };
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
