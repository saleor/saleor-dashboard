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
  getGteLteVariables
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
  const { active, multiple, name, value } = filter;

  switch (name) {
    case ProductFilterKeys.price:
      if (!active) {
        return {
          priceFrom: undefined,
          priceTo: undefined
        };
      }
      if (multiple) {
        return {
          priceFrom: value[0],
          priceTo: value[1]
        };
      }

      return {
        priceFrom: value[0],
        priceTo: value[0]
      };

    case ProductFilterKeys.status:
      if (!active) {
        return {
          status: undefined
        };
      }
      return {
        status: findValueInEnum(value[0], ProductStatus)
      };

    case ProductFilterKeys.stock:
      if (!active) {
        return {
          stockStatus: undefined
        };
      }
      return {
        stockStatus: findValueInEnum(value[0], StockAvailability)
      };
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
