import { defineMessages } from "react-intl";

export const voucherCatalogueMessages = defineMessages({
  title: {
    id: "sIsiBT",
    defaultMessage: "Eligible products",
    description: "voucher catalogue section title",
  },
  introEmpty: {
    id: "deqK6f",
    defaultMessage:
      "Assign at least one category, collection, product, or variant. The discount applies to checkout lines matching any assignment.",
    description: "voucher catalogue section intro when empty",
  },
  intro: {
    id: "YmZVN0",
    defaultMessage:
      "Discount applies to checkout lines matching any assigned category, collection, product, or variant. Products must be available in the voucher's channels.",
    description: "voucher catalogue section intro",
  },
  categoriesTitle: {
    id: "VxLx9C",
    defaultMessage: "Categories",
    description: "voucher catalogue categories row title",
  },
  categoriesDescription: {
    id: "sFHqd1",
    defaultMessage: "Discount lines in these categories.",
    description: "voucher catalogue categories row description",
  },
  collectionsTitle: {
    id: "sKbtzQ",
    defaultMessage: "Collections",
    description: "voucher catalogue collections row title",
  },
  collectionsDescription: {
    id: "7DXZAW",
    defaultMessage: "Discount lines in these collections.",
    description: "voucher catalogue collections row description",
  },
  productsTitle: {
    id: "1OB3se",
    defaultMessage: "Products",
    description: "voucher catalogue products row title",
  },
  productsDescription: {
    id: "ltUYde",
    defaultMessage: "Discount specific products and all their variants.",
    description: "voucher catalogue products row description",
  },
  variantsTitle: {
    id: "vAU2vD",
    defaultMessage: "Variants",
    description: "voucher catalogue variants row title",
  },
  variantsDescription: {
    id: "Q6Rz5F",
    defaultMessage: "Discount only the selected product variants.",
    description: "voucher catalogue variants row description",
  },
  assignedCount: {
    id: "x/Bb2C",
    defaultMessage: "{count, plural, =0 {None assigned} one {# assigned} other {# assigned}}",
    description: "voucher catalogue row assigned count status",
  },
  assignCategoriesAria: {
    id: "I1rBO+",
    defaultMessage: "Assign categories",
    description: "voucher catalogue assign categories aria label",
  },
  assignCollectionsAria: {
    id: "aFA7tU",
    defaultMessage: "Assign collections",
    description: "voucher catalogue assign collections aria label",
  },
  assignProductsAria: {
    id: "hk2GiM",
    defaultMessage: "Assign products",
    description: "voucher catalogue assign products aria label",
  },
  assignVariantsAria: {
    id: "+hXD2U",
    defaultMessage: "Assign variants",
    description: "voucher catalogue assign variants aria label",
  },
});
