// @ts-strict-ignore
import { FilterElement, FilterElementRegular } from "@dashboard/components/Filter";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import { SaleFilterKeys, SaleListFilterOpts } from "@dashboard/discounts/components/SaleListPage";
import { DiscountStatusEnum, DiscountValueTypeEnum, SaleFilterInput } from "@dashboard/graphql";
import { findValueInEnum, joinDateTime, maybe } from "@dashboard/misc";

import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
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
  SaleListUrlQueryParams,
} from "../../urls";

export const SALE_FILTERS_KEY = "saleFilters";

export function getFilterOpts(
  params: SaleListUrlFilters,
  channels: SingleAutocompleteChoiceType[],
): SaleListFilterOpts {
  return {
    channel: {
      active: params?.channel !== undefined,
      choices: channels,
      value: params?.channel,
    },
    saleType: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, DiscountValueTypeEnum)),
    },
    started: {
      active: maybe(
        () => [params.startedFrom, params.startedTo].some(field => field !== undefined),
        false,
      ),
      value: {
        max: maybe(() => params.startedTo, ""),
        min: maybe(() => params.startedFrom, ""),
      },
    },
    status: {
      active: !!maybe(() => params.status),
      value: dedupeFilter(
        params.status?.map(status => findValueInEnum(status, DiscountStatusEnum)) || [],
      ),
    },
  };
}

export function getFilterVariables(params: SaleListUrlFilters): SaleFilterInput {
  return {
    saleType: params.type && findValueInEnum(params.type, DiscountValueTypeEnum),
    search: params.query,
    started: getGteLteVariables({
      gte: joinDateTime(params.startedFrom),
      lte: joinDateTime(params.startedTo),
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

export const storageUtils = createFilterTabUtils<string>(SALE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  SaleListUrlQueryParams,
  SaleListUrlFilters
>({
  ...SaleListUrlFiltersEnum,
  ...SaleListUrlFiltersWithMultipleValues,
});
