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
});
