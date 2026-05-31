import { defineMessages } from "react-intl";

export const messages = defineMessages({
  productTypeLabel: {
    id: "iLNRJL",
    defaultMessage: "Product type",
    description: "product type a11y label prefix",
  },
  viewProductsOfProductType: {
    id: "26U5ba",
    defaultMessage: "View products of {productTypeName}",
    description: "product type scope link in product header, opens filtered catalog list",
  },
  productTypeListFilterUnavailable: {
    id: "S4l46I",
    defaultMessage:
      "Cannot open a filtered product list for this type. Use the menu to open product type settings.",
    description:
      "tooltip on product type label in header when slug is missing and catalog filter link is unavailable",
  },
});
