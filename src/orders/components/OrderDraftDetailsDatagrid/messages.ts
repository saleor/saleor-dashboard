import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  product: {
    id: "x/ZVlU",
    defaultMessage: "Product",
  },
  quantity: {
    id: "nEWp+k",
    defaultMessage: "Quantity",
    description: "quantity of ordered products",
  },
  variantName: {
    id: "OK5+Fh",
    defaultMessage: "Variant",
  },
  price: {
    id: "32dfzI",
    defaultMessage: "Price",
    description: "price or ordered products",
  },
  total: {
    id: "lVwmf5",
    defaultMessage: "Total",
    description: "total price of ordered products",
  },
  isGift: {
    id: "J3W5LI",
    defaultMessage: "Is gift",
    description: "order line is gift",
  },
  status: {
    id: "tzMNF3",
    defaultMessage: "Status",
  },
});

export const messages = defineMessages({
  emptyText: {
    id: "Q1Uzbb",
    defaultMessage: "No products found",
  },
  productDetails: {
    id: "VYK2nN",
    defaultMessage: "Product details",
  },
  deleteOrder: {
    id: "LKD6fB",
    defaultMessage: "Remove product",
  },
  editDiscount: {
    id: "DhFqJF",
    defaultMessage: "Edit discount",
  },
  addDiscount: {
    id: "HpxNPd",
    defaultMessage: "Add discount",
  },
  showMetadata: {
    id: "11ep0q",
    defaultMessage: "Show metadata",
    description: "button",
  },
  removeProductDialogTitle: {
    id: "fdJjic",
    defaultMessage: "Remove product",
    description: "dialog title for removing product from draft order",
  },
  keepProductButton: {
    id: "uY8rPp",
    defaultMessage: "Keep product",
    description: "button label to cancel product removal",
  },
  removeProductButton: {
    id: "McotWC",
    defaultMessage: "Remove product",
    description: "button label to confirm product removal",
  },
  removeProductDialogContent: {
    id: "th06kZ",
    defaultMessage: "Are you sure you want to remove {productName} from this draft order?",
    description: "dialog body asking to confirm product removal from draft order",
  },
  unknownProductFallback: {
    id: "GrMiRT",
    defaultMessage: "this product",
    description: "fallback product name in remove product confirmation dialog",
  },
});
