import { defineMessages } from "react-intl";

export const messages = defineMessages({
  productAssigned: {
    id: "AS39WJ",
    defaultMessage: "Product moved to this category",
    description:
      "success toast after assigning products; category is a singular FK so assign moves",
  },
  productUnassigned: {
    id: "oTb9cg",
    defaultMessage: "Removed product from category",
  },
  productsUnassigned: {
    id: "XG2mph",
    defaultMessage: "Removed products from category",
  },
  unassignTitle: {
    id: "P/yK/7",
    defaultMessage: "Remove products from category",
    description: "dialog title",
  },
  unassignBody: {
    id: "7OMaiR",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to remove this product from the category?} other{Are you sure you want to remove {displayQuantity} products from the category?}}",
  },
});
