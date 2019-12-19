import { IntlShape } from "react-intl";

import { findInEnum, maybe } from "@saleor/misc";
import {
  createOptionsField,
  createPriceField
} from "@saleor/utils/filters/fields";
import { IFilterElement, IFilter } from "../../../components/Filter";
import {
  ProductFilterInput,
  StockAvailability
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersEnum,
  ProductListUrlQueryParams
} from "../../urls";
import messages from "./messages";

export const PRODUCT_FILTERS_KEY = "productFilters";

export enum ProductFilterKeys {
  status = "status",
  price = "price",
  stock = "stock"
}

export enum ProductStatus {
  PUBLISHED = "published",
  HIDDEN = "hidden"
}

export function createFilterStructure(
  intl: IntlShape,
  params: ProductListUrlFilters
): IFilter<ProductFilterKeys> {
  return [
    {
      ...createOptionsField(
        ProductFilterKeys.status,
        intl.formatMessage(messages.visibility),
        [ProductStatus.PUBLISHED],
        false,
        [
          {
            label: intl.formatMessage(messages.visible),
            value: ProductStatus.PUBLISHED
          },
          {
            label: intl.formatMessage(messages.hidden),
            value: ProductStatus.HIDDEN
          }
        ]
      ),
      active: maybe(() => params.status !== undefined, false)
    },
    {
      ...createOptionsField(
        ProductFilterKeys.stock,
        intl.formatMessage(messages.quantity),
        [StockAvailability.IN_STOCK],
        false,
        [
          {
            label: intl.formatMessage(messages.available),
            value: StockAvailability.IN_STOCK
          },
          {
            label: intl.formatMessage(messages.outOfStock),
            value: StockAvailability.OUT_OF_STOCK
          }
        ]
      ),
      active: maybe(() => params.stockStatus !== undefined, false)
    },
    {
      ...createPriceField(
        ProductFilterKeys.price,
        intl.formatMessage(messages.price),
        {
          max: maybe(() => params.priceTo, "0"),
          min: maybe(() => params.priceFrom, "0")
        }
      ),
      active: maybe(
        () =>
          [params.priceFrom, params.priceTo].some(field => field !== undefined),
        false
      )
    }
  ];
}

export function getFilterVariables(
  params: ProductListUrlFilters
): ProductFilterInput {
  return {
    isPublished:
      params.status !== undefined
        ? params.status === ProductStatus.PUBLISHED
        : null,
    price: {
      gte: parseFloat(params.priceFrom),
      lte: parseFloat(params.priceTo)
    },
    search: params.query,
    stockAvailability: StockAvailability[params.stockStatus]
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductFilterKeys>
): ProductListUrlFilters {
  const { active, name, value } = filter;

  if (active) {
    switch (name) {
      case ProductFilterKeys.price:
        return {
          priceFrom: value[0],
          priceTo: value[1]
        };

      case ProductFilterKeys.status:
        return {
          status: (
            findInEnum(value[0], ProductStatus) === ProductStatus.PUBLISHED
          ).toString()
        };

      case ProductFilterKeys.stock:
        return {
          status: findInEnum(value[0], StockAvailability)
        };
    }
  }
}
export function createFilterQueryParams(
  filter: IFilter<ProductFilterKeys>
): ProductListUrlFilters {
  return filter.reduce(
    (acc, filterField) => ({
      ...acc,
      ...getFilterQueryParam(filterField)
    }),
    {}
  );
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
