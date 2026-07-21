import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    defaultMessage: "Add product from {channelName}",
    description: "dialog header",
    id: "4XhJY+",
  },
  subtitle: {
    defaultMessage: "You can only add products available for the order's channel",
    id: "Taa5V7",
    description: "dialog subtitle",
  },
  search: {
    defaultMessage: "Search products",
    description: "search label",
    id: "s6oAC+",
  },
  searchPlaceholder: {
    defaultMessage: "Search by product name, attribute, product type etc...",
    description: "search placeholder",
    id: "S2xLxV",
  },
  sku: {
    defaultMessage: "SKU {sku}",
    description: "variant sku",
    id: "+HuipK",
  },
  noProductsInChannel: {
    id: "shmSDX",
    defaultMessage: "No products are available in the channel assigned to this order.",
    description: "no products placeholder",
  },
  noProductsInQuery: {
    id: "9mrWKz",
    defaultMessage:
      "No products are available matching query in the channel assigned to this order.",
    description: "no products placeholder",
  },
  loadMoreVariants: {
    id: "lNfSYi",
    defaultMessage: "Load more variants",
    description: "button to fetch the next page of variants for a product in order add-line",
  },
  loadingMoreVariants: {
    id: "vmX9L4",
    defaultMessage: "Loading more",
    description: "loading state label on the load more variants button",
  },
  loadMoreVariantsProgress: {
    id: "gf1eAF",
    defaultMessage: "Showing {shown} with a price in this channel · {loaded} of {total} loaded",
    description:
      "Explains that only priced variants are listed, while loaded counts every fetched variant page",
  },
});
