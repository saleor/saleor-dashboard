import { FilterElement, FilterElementRegular } from "@dashboard/components/Filter/types";
import { SaleFilterKeys } from "@dashboard/discounts/components/SaleListPage";
import { DiscountStatusEnum, DiscountValueTypeEnum, SaleFilterInput } from "@dashboard/graphql";
import { findValueInEnum, joinDateTime } from "@dashboard/misc";

import {
  getGteLteVariables,
  getMinMaxQueryParam,
  getMultipleEnumValueQueryParam,
  getSingleEnumValueQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  SaleListUrlFilters,
  SaleListUrlFiltersEnum,
  SaleListUrlFiltersWithMultipleValues,
} from "../../urls";

export function getFilterVariables(params: SaleListUrlFilters): SaleFilterInput {
  return {
    saleType: params.type ? findValueInEnum(params.type, DiscountValueTypeEnum) : undefined,
    search: params.query,
    started: getGteLteVariables({
      gte: params.startedFrom ? joinDateTime(params.startedFrom) : undefined,
      lte: params.startedTo ? joinDateTime(params.startedTo) : undefined,
    }),
    status:
      params.status && params.status.map(status => findValueInEnum(status, DiscountStatusEnum)),
  };
}

export function getFilterQueryParam(filter: FilterElement<SaleFilterKeys>): SaleListUrlFilters {
  const { name } = filter;

  switch (name) {
    case SaleFilterKeys.saleType:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<SaleFilterKeys.saleType>,
        SaleListUrlFiltersEnum.type,
        DiscountValueTypeEnum,
      );

    case SaleFilterKeys.started:
      return getMinMaxQueryParam(
        filter,
        SaleListUrlFiltersEnum.startedFrom,
        SaleListUrlFiltersEnum.startedTo,
      );

    case SaleFilterKeys.status:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<SaleFilterKeys.status>,
        SaleListUrlFiltersWithMultipleValues.status,
        DiscountStatusEnum,
      );

    case SaleFilterKeys.channel:
      return getSingleValueQueryParam(filter, SaleListUrlFiltersEnum.channel);
  }
}
