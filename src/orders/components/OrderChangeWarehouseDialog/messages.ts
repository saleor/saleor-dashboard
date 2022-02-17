import { defineMessages } from "react-intl";

export const changeWarehouseDialogMessages = defineMessages({
  dialogTitle: {
    defaultMessage: "Change warehouse",
    description: "change warehouse dialog title"
  },
  dialogDescription: {
    defaultMessage: "Choose warehouse you want to fulfill this order from",
    description: "change warehouse dialog description"
  },
  searchFieldPlaceholder: {
    defaultMessage: "Search warehouses",
    description: "change warehouse dialog search placeholder"
  },
  warehouseListLabel: {
    defaultMessage: "Warehouses A to Z",
    description: "change warehouse dialog warehouse list label"
  },
  productUnavailable: {
    defaultMessage: "{productName} is unavailable at this location",
    description: "warehouse label when one product is unavailable"
  },
  multipleProductsUnavailable: {
    defaultMessage: "{productCount} products are unavailable at this location",
    description: "warehouse label when multiple products are unavailable"
  },
  currentSelection: {
    defaultMessage: "currently selected",
    description: "label for currently selected warehouse"
  }
});
