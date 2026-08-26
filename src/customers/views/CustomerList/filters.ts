import { type FilterElement } from "@dashboard/components/Filter/types";
import { CustomerFilterKeys } from "@dashboard/customers/components/CustomerListPage";
import { type CustomerFilterInput } from "@dashboard/graphql";

import { getGteLteVariables, getMinMaxQueryParam } from "../../../utils/filters";
import { type CustomerListUrlFilters, CustomerListUrlFiltersEnum } from "../../urls";

export function getFilterVariables(params: CustomerListUrlFilters): CustomerFilterInput {
  return {
    dateJoined: getGteLteVariables({
      gte: params.joinedFrom,
      lte: params.joinedTo,
    }),
    numberOfOrders: getGteLteVariables({
      gte: params?.numberOfOrdersFrom ? parseInt(params.numberOfOrdersFrom, 10) : null,
      lte: params?.numberOfOrdersTo ? parseInt(params.numberOfOrdersTo, 10) : null,
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
