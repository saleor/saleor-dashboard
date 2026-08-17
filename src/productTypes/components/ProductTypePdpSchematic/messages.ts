import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "6gTlK0",
    defaultMessage: "On the product page",
    description: "product type PDP schematic card title",
  },
  badge: {
    id: "cGrYq9",
    defaultMessage: "Paper",
    description: "accessible name for the Paper mark on the PDP schematic",
  },
  subtitle: {
    id: "V4WHQd",
    defaultMessage: "How this type shows on the Paper Storefront — schematic, not a live preview.",
    description: "product type PDP schematic card subtitle",
  },
  shopperPicks: {
    id: "aNWfW2",
    defaultMessage: "Shopper picks",
    description: "PDP schematic label for variant option pickers",
  },
  productDetails: {
    id: "M3xQ+S",
    defaultMessage: "Product details",
    description: "PDP schematic label for product attributes on the storefront",
  },
  variantFacts: {
    id: "T9UEX/",
    defaultMessage: "Variant facts",
    description: "PDP schematic label for non-selection variant attributes",
  },
  noPickers: {
    id: "lxgrqS",
    defaultMessage: "No pickers — sold as a single variant",
    description: "PDP schematic when the type has options turned off",
  },
  assignOptions: {
    id: "A4tbpO",
    defaultMessage: "Assign options below",
    description: "PDP schematic empty state for variant pickers",
  },
  assignAttributes: {
    id: "nzhLC0",
    defaultMessage: "Assign attributes below",
    description: "PDP schematic empty state for product details",
  },
  assignFacts: {
    id: "7dVB7S",
    defaultMessage: "Assign below — leave <em>Variant selection</em> off",
    description: "PDP schematic empty state for non-selection variant attributes",
  },
  factsNeedOptions: {
    id: "7wVtd8",
    defaultMessage: "Turn on options to use variant attributes",
    description: "PDP schematic variant facts when the type has a single variant",
  },
  legendOptions: {
    id: "OMD3t+",
    defaultMessage:
      "Variant attributes with <em>Variant selection</em> on. Shoppers choose these; you set the values on each variant.",
    description: "PDP schematic legend for selectable variant attributes",
  },
  legendSpecs: {
    id: "UZgAy6",
    defaultMessage: "Product attributes. Set once on the product — every variant shares them.",
    description: "PDP schematic legend for product attributes",
  },
  legendFacts: {
    id: "yQnwGt",
    defaultMessage:
      "Variant attributes with <em>Variant selection</em> off. Set on each variant; shoppers don’t pick them.",
    description: "PDP schematic legend for non-selection variant attributes",
  },
  legendSection: {
    id: "XkQXIn",
    defaultMessage: "Where attributes show",
    description: "PDP schematic full-bleed legend section header",
  },
  dismiss: {
    id: "A6eUgr",
    defaultMessage: "Dismiss",
    description: "hides the PDP schematic for all product types until restored from the page menu",
  },
  figureLabel: {
    id: "EbHtGh",
    defaultMessage:
      "Schematic of a product page: shopper picks and variant facts in the buy box, product details under the photos.",
    description: "accessible label for the PDP schematic figure",
  },
});
