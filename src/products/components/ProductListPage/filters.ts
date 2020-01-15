import { defineMessages, IntlShape } from "react-intl";

import { FilterOpts, MinMax, AutocompleteFilterOpts } from "@saleor/types";
import { StockAvailability } from "@saleor/types/globalTypes";
import {
  createOptionsField,
  createPriceField,
  createAutocompleteField
} from "@saleor/utils/filters/fields";
import { IFilter } from "@saleor/components/Filter";
import { sectionNames } from "@saleor/intl";

export enum ProductFilterKeys {
  categories = "categories",
  collections = "collections",
  status = "status",
  price = "price",
  stock = "stock"
}

export interface ProductListFilterOpts {
  categories: FilterOpts<string[]> & AutocompleteFilterOpts;
  collections: FilterOpts<string[]> & AutocompleteFilterOpts;
  price: FilterOpts<MinMax>;
  status: FilterOpts<ProductStatus>;
  stockStatus: FilterOpts<StockAvailability>;
}

export enum ProductStatus {
  PUBLISHED = "published",
  HIDDEN = "hidden"
}

const messages = defineMessages({
  available: {
    defaultMessage: "Available",
    description: "product status"
  },
  hidden: {
    defaultMessage: "Hidden",
    description: "product is hidden"
  },
  outOfStock: {
    defaultMessage: "Out Of Stock",
    description: "product status"
  },
  price: {
    defaultMessage: "Price"
  },
  quantity: {
    defaultMessage: "Stock quantity",
    description: "product"
  },
  visibility: {
    defaultMessage: "Visibility",
    description: "product visibility"
  },
  visible: {
    defaultMessage: "Visible",
    description: "product is visible"
  }
});

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
    },
    {
      ...createAutocompleteField(
        ProductFilterKeys.categories,
        intl.formatMessage(sectionNames.categories),
        opts.categories.value,
        opts.categories.displayValues,
        true,
        opts.categories.choices,
        {
          hasMore: opts.categories.hasMore,
          initialSearch: "",
          loading: opts.categories.loading,
          onFetchMore: opts.categories.onFetchMore,
          onSearchChange: opts.categories.onSearchChange
        }
      ),
      active: opts.categories.active
    },
    {
      ...createAutocompleteField(
        ProductFilterKeys.collections,
        intl.formatMessage(sectionNames.collections),
        opts.collections.value,
        opts.collections.displayValues,
        true,
        opts.collections.choices,
        {
          hasMore: opts.collections.hasMore,
          initialSearch: "",
          loading: opts.collections.loading,
          onFetchMore: opts.collections.onFetchMore,
          onSearchChange: opts.collections.onSearchChange
        }
      ),
      active: opts.collections.active
    }
  ];
}
