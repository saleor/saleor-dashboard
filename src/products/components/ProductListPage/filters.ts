import { IFilter } from "@saleor/components/Filter";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { AttributeInputTypeEnum, StockAvailability } from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import {
  AutocompleteFilterOpts,
  FilterOpts,
  KeyValue,
  MinMax,
} from "@saleor/types";
import {
  createAutocompleteField,
  createBooleanField,
  createDateField,
  createDateTimeField,
  createKeyValueField,
  createNumberField,
  createOptionsField,
  createPriceField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum ProductFilterKeys {
  attributes = "attributes",
  categories = "categories",
  collections = "collections",
  metadata = "metadata",
  price = "price",
  productType = "productType",
  stock = "stock",
  channel = "channel",
  productKind = "productKind",
}

export type AttributeFilterOpts = FilterOpts<string[]> & {
  id: string;
  name: string;
  slug: string;
  inputType: AttributeInputTypeEnum;
};

export interface ProductListFilterOpts {
  attributes: AttributeFilterOpts[];
  attributeChoices: FilterOpts<string[]> & AutocompleteFilterOpts;
  categories: FilterOpts<string[]> & AutocompleteFilterOpts;
  collections: FilterOpts<string[]> & AutocompleteFilterOpts;
  metadata: FilterOpts<KeyValue[]>;
  price: FilterOpts<MinMax>;
  productType: FilterOpts<string[]> & AutocompleteFilterOpts;
  stockStatus: FilterOpts<StockAvailability>;
  channel: FilterOpts<string> & { choices: SingleAutocompleteChoiceType[] };
  productKind: FilterOpts<string> & { choices: SingleAutocompleteChoiceType[] };
}

const messages = defineMessages({
  available: {
    id: "diOQm7",
    defaultMessage: "Available",
    description: "product status",
  },
  channel: {
    id: "pbGIUg",
    defaultMessage: "Channel",
    description: "sales channel",
  },
  kind: {
    id: "pBTTtU",
    defaultMessage: "Product Kind",
    description: "product kind",
  },
  hidden: {
    id: "Bx367s",
    defaultMessage: "Hidden",
    description: "product is hidden",
  },
  metadata: {
    defaultMessage: "Metadata",
    id: "8Q504V",
  },
  outOfStock: {
    id: "Sna+WK",
    defaultMessage: "Out Of Stock",
    description: "product status",
  },
  price: {
    id: "b1zuN9",
    defaultMessage: "Price",
  },
  quantity: {
    id: "3Z8972",
    defaultMessage: "Stock quantity",
    description: "product",
  },
  visibility: {
    id: "g+GAf4",
    defaultMessage: "Visibility",
    description: "product visibility",
  },
  visible: {
    id: "6Y1nQd",
    defaultMessage: "Visible",
    description: "product is visible",
  },
});

const filterByType = (type: AttributeInputTypeEnum) => (
  attribute: AttributeFilterOpts,
) => attribute.inputType === type;

export function createFilterStructure(
  intl: IntlShape,
  opts: ProductListFilterOpts,
): IFilter<string> {
  const attributes = opts.attributes;

  const booleanAttributes = attributes.filter(
    filterByType(AttributeInputTypeEnum.BOOLEAN),
  );
  const dateAttributes = attributes.filter(
    filterByType(AttributeInputTypeEnum.DATE),
  );
  const dateTimeAttributes = attributes.filter(
    filterByType(AttributeInputTypeEnum.DATE_TIME),
  );
  const numericAttributes = attributes.filter(
    filterByType(AttributeInputTypeEnum.NUMERIC),
  );

  const defaultAttributes = opts.attributes.filter(
    ({ inputType }) =>
      ![
        AttributeInputTypeEnum.BOOLEAN,
        AttributeInputTypeEnum.DATE,
        AttributeInputTypeEnum.DATE_TIME,
        AttributeInputTypeEnum.NUMERIC,
      ].includes(inputType),
  );

  return [
    {
      ...createOptionsField(
        ProductFilterKeys.channel,
        intl.formatMessage(messages.channel),
        [opts.channel.value],
        false,
        opts.channel.choices,
      ),
      active: opts.channel.active,
    },
    {
      ...createKeyValueField(
        ProductFilterKeys.metadata,
        intl.formatMessage(messages.metadata),
        opts.metadata.value,
      ),
      active: opts.metadata.active,
    },
    {
      ...createOptionsField(
        ProductFilterKeys.productKind,
        intl.formatMessage(messages.kind),
        [opts.productKind.value],
        false,
        opts.productKind.choices,
      ),
      active: opts.productKind.active,
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
            value: StockAvailability.IN_STOCK,
          },
          {
            label: intl.formatMessage(messages.outOfStock),
            value: StockAvailability.OUT_OF_STOCK,
          },
        ],
      ),
      active: opts.stockStatus.active,
      dependencies: [ProductFilterKeys.channel],
    },
    {
      ...createPriceField(
        ProductFilterKeys.price,
        intl.formatMessage(messages.price),
        opts.price.value,
      ),
      active: opts.price.active,
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
          onSearchChange: opts.categories.onSearchChange,
        },
      ),
      active: opts.categories.active,
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
          onSearchChange: opts.collections.onSearchChange,
        },
      ),
      active: opts.collections.active,
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
          onSearchChange: opts.productType.onSearchChange,
        },
      ),
      active: opts.productType.active,
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
          negative: intl.formatMessage(commonMessages.no),
        },
      ),
      active: attr.active,
      group: ProductFilterKeys.attributes,
    })),
    ...dateAttributes.map(attr => ({
      ...createDateField(attr.slug, attr.name, {
        min: attr.value[0],
        max: attr.value[1] ?? attr.value[0],
      }),
      active: attr.active,
      group: ProductFilterKeys.attributes,
    })),
    ...dateTimeAttributes.map(attr => ({
      ...createDateTimeField(attr.slug, attr.name, {
        min: attr.value[0],
        max: attr.value[1] ?? attr.value[0],
      }),
      active: attr.active,
      group: ProductFilterKeys.attributes,
    })),
    ...numericAttributes.map(attr => ({
      ...createNumberField(attr.slug, attr.name, {
        min: attr.value[0],
        max: attr.value[1] ?? attr.value[0],
      }),
      active: attr.active,
      group: ProductFilterKeys.attributes,
    })),
    ...defaultAttributes.map(attr => ({
      ...createAutocompleteField(
        attr.slug,
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
          onSearchChange: opts.attributeChoices.onSearchChange,
        },
        attr.id,
      ),
      active: attr.active,
      group: ProductFilterKeys.attributes,
    })),
  ];
}
