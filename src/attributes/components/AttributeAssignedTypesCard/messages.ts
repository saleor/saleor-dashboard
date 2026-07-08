import { defineMessages } from "react-intl";

export const attributeAssignedTypesCardMessages = defineMessages({
  title: {
    id: "o+5eA9",
    defaultMessage: "Usage",
    description: "attribute detail sidebar card title for type assignments",
  },
  emptyProductUsage: {
    id: "tpM9O2",
    defaultMessage: "Not used on any product types yet.",
    description: "empty state when attribute is not assigned to product types",
  },
  emptyModelUsage: {
    id: "bbBirg",
    defaultMessage: "Not used on any model types yet.",
    description: "empty state when attribute is not assigned to model types",
  },
  assignOnProductTypeHint: {
    id: "u2KDfU",
    defaultMessage: "Assign this attribute from a {link}.",
    description: "hint linking to product types settings",
  },
  assignOnModelTypeHint: {
    id: "1y3hRg",
    defaultMessage: "Assign this attribute from a {link}.",
    description: "hint linking to model types settings",
  },
  productTypesLink: {
    id: "hOZsq5",
    defaultMessage: "product type",
    description: "link label in usage empty state",
  },
  modelTypesLink: {
    id: "QBgj2A",
    defaultMessage: "model type",
    description: "link label in usage empty state",
  },
  summaryProductTypes: {
    id: "GDHGAK",
    defaultMessage: "{count, plural, one {# product type} other {# product types}}",
    description: "usage summary when attribute is only on product types",
  },
  summaryVariantTypes: {
    id: "tqV6rg",
    defaultMessage: "{count, plural, one {# variant type} other {# variant types}}",
    description: "usage summary when attribute is only on variant types",
  },
  summaryMixedTypes: {
    id: "zGvkK2",
    defaultMessage:
      "{productCount, plural, one {# product type} other {# product types}}, {variantCount, plural, one {# variant type} other {# variant types}}",
    description: "usage summary when attribute is on both product and variant types",
  },
  summaryModelTypes: {
    id: "B3dqGE",
    defaultMessage: "{count, plural, one {# model type} other {# model types}}",
    description: "usage summary for model attribute assignments",
  },
  roleProduct: {
    id: "s6Wgi3",
    defaultMessage: "Product",
    description: "role label for product-level type assignment",
  },
  roleVariant: {
    id: "c1z3+H",
    defaultMessage: "Variant",
    description: "role label for variant-level type assignment",
  },
  truncatedTypes: {
    id: "acLsce",
    defaultMessage: "Showing first {count} types.",
    description: "truncation hint when usage list hits query limit",
  },
});
