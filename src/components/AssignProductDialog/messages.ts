import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignVariantDialogHeader: {
    id: "juxCV3",
    defaultMessage: "Assign product",
    description: "dialog header",
  },
  assignProductDialogButton: {
    id: "Nv/toB",
    defaultMessage: "Assign and save",
    description: "button",
  },
  assignCountedButton: {
    defaultMessage: "{label} ({count, plural, one {# item} other {# items}})",
    id: "vFljxe",
    description: "assign button label with number of selected items",
  },
  assignProductDialogContent: {
    id: "un+VWt",
    defaultMessage: "Search products",
  },
  assignProductDialogSearch: {
    id: "SHm7ee",
    defaultMessage: "Search by product name, attribute, product type etc...",
  },
  noProductsFound: {
    id: "wWELJW",
    defaultMessage: "No products found",
    description: "search results",
  },
  selectAllMatchingProducts: {
    id: "EQ/R+B",
    defaultMessage: "Select all visible products",
    description:
      "select all loaded products in assign product picker when filters or search are active",
  },
  selectAllScrollHint: {
    id: "sRf1ZK",
    defaultMessage: "Scroll to load more products.",
    description: "hint below select all when more products can be loaded in assign product picker",
  },
  allLoadedProductsFilteredOut: {
    id: "DpB9Oq",
    defaultMessage:
      "Every product loaded so far is already assigned. Search for a product by name, or keep loading the catalog.",
    description: "assign product picker, client-side filter emptied the loaded pages",
  },
  loadMoreProducts: {
    id: "miimrR",
    defaultMessage: "Load more products",
    description: "button, assign product picker",
  },
});
