import {
  DiscountStatusEnum,
  DiscountValueTypeEnum,
  SaleFilterInput
} from "@saleor/types/globalTypes";
import { maybe, findValueInEnum, joinDateTime } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  SaleListFilterOpts,
  SaleFilterKeys
} from "@saleor/discounts/components/SaleListPage";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getGteLteVariables,
  getSingleEnumValueQueryParam,
  getMinMaxQueryParam,
  getMultipleEnumValueQueryParam
} from "../../../utils/filters";
import {
  SaleListUrlFilters,
  SaleListUrlFiltersEnum,
  SaleListUrlQueryParams,
  SaleListUrlFiltersWithMultipleValues
} from "../../urls";

export const SALE_FILTERS_KEY = "saleFilters";

export function getFilterOpts(params: SaleListUrlFilters): SaleListFilterOpts {
  return {
    saleType: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, DiscountValueTypeEnum))
    },
    started: {
      active: maybe(
        () =>
          [params.startedFrom, params.startedTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.startedTo, ""),
        min: maybe(() => params.startedFrom, "")
      }
    },
    status: {
      active: !!maybe(() => params.status),
      value: maybe(
        () =>
          dedupeFilter(
            params.status.map(status =>
              findValueInEnum(status, DiscountStatusEnum)
            )
          ),
        []
      )
    }
  };
}

export function getFilterVariables(
  params: SaleListUrlFilters
): SaleFilterInput {
  return {
    saleType:
      params.type && findValueInEnum(params.type, DiscountValueTypeEnum),
    search: params.query,
    started: getGteLteVariables({
      gte: joinDateTime(params.startedFrom),
      lte: joinDateTime(params.startedTo)
    }),
    status:
      params.status &&
      params.status.map(status => findValueInEnum(status, DiscountStatusEnum))
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<SaleFilterKeys>
): SaleListUrlFilters {
  const { name } = filter;

  switch (name) {
    case SaleFilterKeys.saleType:
      return getSingleEnumValueQueryParam(
        filter,
        SaleListUrlFiltersEnum.type,
        DiscountValueTypeEnum
      );

    case SaleFilterKeys.started:
      return getMinMaxQueryParam(
        filter,
        SaleListUrlFiltersEnum.startedFrom,
        SaleListUrlFiltersEnum.startedTo
      );

    case SaleFilterKeys.status:
      return getMultipleEnumValueQueryParam(
        filter,
        SaleListUrlFiltersWithMultipleValues.status,
        DiscountStatusEnum
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<SaleListUrlFilters>(SALE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  SaleListUrlQueryParams,
  SaleListUrlFilters
>(SaleListUrlFiltersEnum);
