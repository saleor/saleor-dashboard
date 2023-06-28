import { defineMessages } from "react-intl";

export const messages = defineMessages({
  emptyText: {
    id: "Q1Uzbb",
    defaultMessage: "No products found",
  },
  addProduct: {
    id: "tiY7bx",
    defaultMessage: "Add new product",
  },
  editProduct: {
    defaultMessage: "Edit Product",
    id: "Q4m1CG",
  },
  products: {
    defaultMessage: "Products",
    id: "7NFfmz",
  },
});

export const columnsMessages = defineMessages({
  availability: {
    id: "+VEhV8",
    defaultMessage: "Availability",
    description: "product channels",
  },
  price: {
    id: "b810WJ",
    defaultMessage: "Price",
    description: "product price",
  },
  type: {
    id: "k+HcTv",
    defaultMessage: "Type",
    description: "product type",
  },
  updatedAt: {
    id: "kVTWtR",
    defaultMessage: "Last updated",
    description: "product updated at",
  },
});

export const categoryMetaGroups = defineMessages({
  attribute: {
    id: "GhY+pm",
    defaultMessage: "Attributes",
    description: "dynamic column description",
  },
});
