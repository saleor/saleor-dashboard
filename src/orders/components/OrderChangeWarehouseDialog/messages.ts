import { defineMessages } from "react-intl";

export const changeWarehouseDialogMessages = defineMessages({
  dialogTitle: {
    defaultMessage: "Change warehouse",
    id: "g9Mb+U",
    description: "change warehouse dialog title",
  },
  dialogDescription: {
    defaultMessage:
      "Choose warehouse from which you want to fulfill {productName}",
    id: "Ila7WO",
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
  productAvailability: {
    defaultMessage: "{productCount} available at this location",
    id: "hLSgWj",
    description: "warehouse label number available of products",
  },
  currentSelection: {
    defaultMessage: "currently selected",
    id: "n0w2ZT",
    description: "label for currently selected warehouse",
  },
});
