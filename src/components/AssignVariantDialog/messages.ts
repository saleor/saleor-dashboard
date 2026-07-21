import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignVariantDialogHeader: {
    id: "xAHOGV",
    defaultMessage: "Assign Variant",
    description: "dialog header",
  },
  assignVariantDialogButton: {
    id: "p4X/0H",
    defaultMessage: "Assign and save",
    description: "button, assign variants to sale and save",
  },
  assignCountedButton: {
    defaultMessage: "{label} ({count, plural, one {# item} other {# items}})",
    id: "vFljxe",
    description: "assign button label with number of selected items",
  },
  assignVariantDialogContent: {
    id: "K+vjtE",
    defaultMessage: "Search Variants",
  },
  assignVariantDialogSearch: {
    id: "SHm7ee",
    defaultMessage: "Search by product name, attribute, product type etc...",
  },
  assignVariantDialogSKU: {
    id: "+HuipK",
    defaultMessage: "SKU {sku}",
    description: "variant sku",
  },
  noProductsInChannel: {
    id: "sAqzEK",
    defaultMessage: "No products available",
    description: "no products placeholder",
  },
  noProductsInQuery: {
    id: "P6+RQ1",
    defaultMessage: "No products found",
    description: "no products placeholder",
  },
  loadMoreVariants: {
    id: "fYRCRL",
    defaultMessage: "Load more variants",
    description: "button to fetch the next page of variants in assign variant dialog",
  },
  loadingMoreVariants: {
    id: "hjamEg",
    defaultMessage: "Loading more",
    description: "loading state on load more variants button in assign variant dialog",
  },
  loadMoreVariantsProgress: {
    id: "TQph+r",
    defaultMessage: "{loaded} of {total} loaded",
    description: "progress under load more variants in assign variant dialog",
  },
});
