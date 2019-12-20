import { IntlShape } from "react-intl";

import { maybe, findValueInEnum } from "@saleor/misc";
import {
  createOptionsField,
  createPriceField
} from "@saleor/utils/filters/fields";
import { ProductStatus, ProductListFilterOpts } from "@saleor/products/types";
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

export function createFilterStructure(
  intl: IntlShape,
  opts: ProductListFilterOpts
): IFilter<ProductFilterKeys> {
  return [
    {
      ...createOptionsField(
        ProductFilterKeys.status,
        intl.formatMessage(messages.visibility),
        [opts.status.value],
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
      active: opts.status.active
    },
    {
      ...createOptionsField(
        ProductFilterKeys.stock,
        intl.formatMessage(messages.quantity),
        [opts.stockStatus.value],
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
      active: opts.stockStatus.active
    },
    {
      ...createPriceField(
        ProductFilterKeys.price,
        intl.formatMessage(messages.price),
        opts.price.value
      ),
      active: opts.price.active
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

  if (active) {
    switch (name) {
      case ProductFilterKeys.price:
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
        return {
          status: findValueInEnum(value[0], ProductStatus)
        };

      case ProductFilterKeys.stock:
        return {
          stockStatus: findValueInEnum(value[0], StockAvailability)
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
