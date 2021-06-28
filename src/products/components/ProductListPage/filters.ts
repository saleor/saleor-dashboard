import { IFilter } from "@saleor/components/Filter";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { commonMessages, sectionNames } from "@saleor/intl";
import { AutocompleteFilterOpts, FilterOpts, MinMax } from "@saleor/types";
import {
  AttributeInputTypeEnum,
  StockAvailability
} from "@saleor/types/globalTypes";
import {
  createAutocompleteField,
  createBooleanField,
  createOptionsField,
  createPriceField
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum ProductFilterKeys {
  attributes = "attributes",
  categories = "categories",
  collections = "collections",
  price = "price",
  productType = "productType",
  stock = "stock",
  channel = "channel"
}

export interface ProductListFilterOpts {
  attributes: Array<
    FilterOpts<string[]> & {
      id: string;
      name: string;
      slug: string;
      inputType: AttributeInputTypeEnum;
    }
  >;
  attributeChoices: FilterOpts<string[]> & AutocompleteFilterOpts;
  categories: FilterOpts<string[]> & AutocompleteFilterOpts;
  collections: FilterOpts<string[]> & AutocompleteFilterOpts;
  price: FilterOpts<MinMax>;
  productType: FilterOpts<string[]> & AutocompleteFilterOpts;
  stockStatus: FilterOpts<StockAvailability>;
  channel: FilterOpts<string> & { choices: SingleAutocompleteChoiceType[] };
}

const messages = defineMessages({
  available: {
    defaultMessage: "Available",
    description: "product status"
  },
  channel: {
    defaultMessage: "Channel",
    description: "sales channel"
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
): IFilter<string> {
  const booleanAttributes = opts.attributes.filter(
    ({ inputType }) => inputType === AttributeInputTypeEnum.BOOLEAN
  );
  const defaultAttributes = opts.attributes.filter(
    ({ inputType }) => !inputType.includes(AttributeInputTypeEnum.BOOLEAN)
  );

  return [
    {
      ...createOptionsField(
        ProductFilterKeys.channel,
        intl.formatMessage(messages.channel),
        [opts.channel.value],
        false,
        opts.channel.choices
      ),
      active: opts.channel.active
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
      active: opts.stockStatus.active,
      dependencies: [ProductFilterKeys.channel]
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
    ...booleanAttributes.map(attr => ({
      ...createBooleanField(
        attr.slug,
        attr.name,
        Array.isArray(attr.value)
          ? undefined
          : (attr.value as unknown) === "true",
        {
          positive: intl.formatMessage(commonMessages.yes),
          negative: intl.formatMessage(commonMessages.no)
        }
      ),
      active: attr.active,
      group: ProductFilterKeys.attributes
    })),
    ...defaultAttributes.map(attr => ({
      ...createAutocompleteField(
        attr.slug as any,
        attr.name,
        attr.value,
        opts.attributeChoices.displayValues,
        true,
        opts.attributeChoices.choices,
        {
          hasMore: opts.attributeChoices.hasMore,
          initialSearch: "",
          loading: opts.attributeChoices.loading,
          onFetchMore: opts.attributeChoices.onFetchMore,
          onSearchChange: opts.attributeChoices.onSearchChange
        },
        attr.id
      ),
      active: attr.active,
      group: ProductFilterKeys.attributes
    }))
  ];
}
