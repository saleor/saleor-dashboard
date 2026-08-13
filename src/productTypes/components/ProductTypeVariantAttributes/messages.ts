import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "DEsXMz",
    defaultMessage: "Variants",
    description: "product type variants section header",
  },
  usesVariantAttributes: {
    id: "yq5/lY",
    defaultMessage: "This type has options",
    description: "product type has-variants toggle title",
  },
  usesVariantAttributesDescription: {
    id: "07l721",
    defaultMessage:
      "Turn on to sell more than one version of a product, like size or color. Saleor still creates a single variant when this is off.",
    description: "product type has-variants toggle description",
  },
  exclusivity: {
    id: "/0EoDh",
    defaultMessage:
      "An attribute can’t be both a product attribute and a variant option on the same type.",
    description: "product type variant attributes exclusivity hint",
  },
  empty: {
    id: "B77MSl",
    defaultMessage: "No variant options yet",
    description: "empty state for variant attributes on a product type",
  },
});
