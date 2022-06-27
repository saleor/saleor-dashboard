import { defineMessages } from "react-intl";

export const changeWarehouseDialogMessages = defineMessages({
  dialogTitle: {
    defaultMessage: "Change warehouse",
    id: "g9Mb+U",
    description: "change warehouse dialog title",
  },
  dialogDescription: {
    defaultMessage: "Choose warehouse you want to fulfill this order from",
    id: "QWCh6/",
    description: "change warehouse dialog description",
  },
  searchFieldPlaceholder: {
    defaultMessage: "Search warehouses",
    id: "WCg2GZ",
    description: "change warehouse dialog search placeholder",
  },
  warehouseListLabel: {
    defaultMessage: "Warehouses A to Z",
    id: "Epm41J",
    description: "change warehouse dialog warehouse list label",
  },
  productUnavailable: {
    defaultMessage: "{productName} is unavailable at this location",
    id: "x4WAC7",
    description: "warehouse label when one product is unavailable",
  },
  multipleProductsUnavailable: {
    defaultMessage: "{productCount} products are unavailable at this location",
    id: "QfKQx3",
    description: "warehouse label when multiple products are unavailable",
  },
  currentSelection: {
    defaultMessage: "currently selected",
    id: "n0w2ZT",
    description: "label for currently selected warehouse",
  },
});
