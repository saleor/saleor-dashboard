import { IFilter } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { sectionNames } from "@saleor/intl";
import { AutocompleteFilterOpts, FilterOpts, MinMax } from "@saleor/types";
import {
  StockAvailability,
  WarehouseLocation
} from "@saleor/types/globalTypes";
import {
  createAutocompleteField,
  createDateField,
  createOptionsField,
  createPriceField,
  createWarehouseField
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum ProductFilterKeys {
  attributes = "attributes",
  categories = "categories",
  collections = "collections",
  updatedAt = "updatedAt",
  status = "status",
  price = "price",
  productType = "productType",
  stock = "stock",
  warehouseLocation = "warehouseLocation"
}

export interface ProductListFilterOpts {
  attributes: Array<
    FilterOpts<string[]> & {
      choices: MultiAutocompleteChoiceType[];
      name: string;
      slug: string;
    }
  >;
  categories: FilterOpts<string[]> & AutocompleteFilterOpts;
  collections: FilterOpts<string[]> & AutocompleteFilterOpts;
  updatedAt?: FilterOpts<MinMax>;
  price: FilterOpts<MinMax>;
  productType: FilterOpts<string[]> & AutocompleteFilterOpts;
  status: FilterOpts<ProductStatus>;
  stockStatus: FilterOpts<StockAvailability>;
  warehouseLocation: FilterOpts<MinMax>;
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
  placed: {
    defaultMessage: "Utworzono",
    description: "product"
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
  },
  warehouseLocation: {
    defaultMessage: "Lokacja magazynowa",
    description: "Find product by warehouse location"
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
      ...createWarehouseField(
        ProductFilterKeys.warehouseLocation,
        intl.formatMessage(messages.warehouseLocation),
        opts.warehouseLocation.value
      ),
      active: opts.warehouseLocation.active
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
    },
    {
      ...createDateField(
        ProductFilterKeys.updatedAt,
        intl.formatMessage(messages.placed),
        opts.updatedAt.value
      ),
      active: opts.updatedAt.active
    },
    {
      ...createAutocompleteField(
        ProductFilterKeys.productType,
        intl.formatMessage(sectionNames.productTypes),
        opts.productType.value,
        opts.productType.displayValues,
        true,
        opts.productType.choices,
        {
          hasMore: opts.productType.hasMore,
          initialSearch: "",
          loading: opts.productType.loading,
          onFetchMore: opts.productType.onFetchMore,
          onSearchChange: opts.productType.onSearchChange
        }
      ),
      active: opts.productType.active
    },
    ...opts.attributes.map(attr => ({
      ...createOptionsField(
        attr.slug as any,
        attr.name,
        attr.value,
        true,
        attr.choices
      ),
      active: attr.active,
      group: ProductFilterKeys.attributes
    }))
  ];
}
