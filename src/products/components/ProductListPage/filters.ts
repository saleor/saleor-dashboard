import { defineMessages, IntlShape } from "react-intl";

import { FilterOpts, MinMax } from "@saleor/types";
import { StockAvailability } from "@saleor/types/globalTypes";
import {
  createOptionsField,
  createPriceField
} from "@saleor/utils/filters/fields";
import { IFilter } from "@saleor/components/Filter";

export enum ProductFilterKeys {
  status = "status",
  price = "price",
  stock = "stock"
}

export interface ProductListFilterOpts {
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
    }
  ];
}
