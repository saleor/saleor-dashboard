import { maybe, findValueInEnum } from "@saleor/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts,
  ProductStatus
} from "@saleor/products/components/ProductListPage";
import { IFilterElement } from "../../../components/Filter";
import {
  ProductFilterInput,
  StockAvailability
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getMinMaxQueryParam,
  getSingleEnumValueQueryParam
} from "../../../utils/filters";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersEnum,
  ProductListUrlQueryParams
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterOpts(
  params: ProductListUrlFilters
): ProductListFilterOpts {
  return {
    price: {
      active: maybe(
        () =>
          [params.priceFrom, params.priceTo].some(field => field !== undefined),
        false
      ),
      value: {
        max: maybe(() => params.priceTo, "0"),
        min: maybe(() => params.priceFrom, "0")
      }
    },
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(params.status, ProductStatus))
    },
    stockStatus: {
      active: maybe(() => params.stockStatus !== undefined, false),
      value: maybe(() => findValueInEnum(params.stockStatus, StockAvailability))
    }
  };
}

export function getFilterVariables(
  params: ProductListUrlFilters
): ProductFilterInput {
  return {
    isPublished:
      params.status !== undefined
        ? params.status === ProductStatus.PUBLISHED
        : null,
    price: getGteLteVariables({
      gte: parseFloat(params.priceFrom),
      lte: parseFloat(params.priceTo)
    }),
    search: params.query,
    stockAvailability:
      params.stockStatus !== undefined
        ? findValueInEnum(params.stockStatus, StockAvailability)
        : null
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductFilterKeys>
): ProductListUrlFilters {
  const { name } = filter;

  switch (name) {
    case ProductFilterKeys.price:
      return getMinMaxQueryParam(
        filter,
        ProductListUrlFiltersEnum.priceFrom,
        ProductListUrlFiltersEnum.priceTo
      );

    case ProductFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.status,
        ProductStatus
      );

    case ProductFilterKeys.stock:
      return getSingleEnumValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.stockStatus,
        StockAvailability
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductListUrlFilters>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductListUrlQueryParams,
  ProductListUrlFilters
>(ProductListUrlFiltersEnum);
