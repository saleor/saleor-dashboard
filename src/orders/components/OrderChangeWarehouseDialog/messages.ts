import { defineMessage } from "react-intl";

export const changeWarehouseDialogMessages = defineMessage({
  dialogTitle: {
    defaultMessage: "Change warehouse",
    description: "change warehouse dialog title",
    id: "test998798722"
  },
  dialogDescription: {
    defaultMessage: "Choose warehouse you want to fulfill this order from",
    description: "change warehouse dialog description",
    id: "test1092831290"
  },
  searchFieldPlaceholder: {
    defaultMessage: "Search warehouses",
    description: "change warehouse dialog search placeholder",
    id: "test9817298112"
  },
  warehouseListLabel: {
    defaultMessage: "Warehouses A to Z",
    description: "change warehouse dialog warehouse list label",
    id: "test278728"
  },
  productUnavailable: {
    defaultMessage: "{productName} is unavailable at this location",
    description: "warehouse label when one product is unavailable",
    id: "test2787282"
  },
  productsUnavailable: {
    defaultMessage: "{productCount} products are unavailable at this location",
    description: "warehouse label when multiple products are unavailable",
    id: "test2787283"
  },
  currentSelection: {
    defaultMessage: "currently selected",
    description: "label for currently selected warehouse",
    id: "test129009213"
  }
});
