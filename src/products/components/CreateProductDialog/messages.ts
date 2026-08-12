import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "u2QjRn",
    defaultMessage: "Create product",
    description: "create product dialog title",
  },
  description: {
    id: "99q9UB",
    defaultMessage:
      "Add a product. You can set a price, inventory, and availability after creating it.",
    description: "create product dialog description",
  },
  created: {
    id: "DO8+uV",
    defaultMessage: "Product created",
  },
  productType: {
    id: "w+3Q3e",
    defaultMessage: "Product type",
    description: "input label",
  },
  createProductTypeTitle: {
    id: "sWLkI9",
    defaultMessage: "Create a product type first",
    description: "dialog header when the shop has no product types",
  },
  emptyTitle: {
    id: "jytxBa",
    defaultMessage: "No product types yet",
    description: "empty state title in product type picker",
  },
  emptyDescription: {
    id: "x8b3Vn",
    defaultMessage:
      "Product types define attributes, variants, and shipping. Create one before you add your first product.",
    description: "empty state description in product type picker",
  },
  createProductType: {
    id: "+Zlqf4",
    defaultMessage: "Create product type",
    description: "CTA when the shop has no product types",
  },
});
