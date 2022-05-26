import { defineMessages } from "react-intl";

export const giftCardsListHeaderMenuItemsMessages = defineMessages({
  settings: {
    id: "F69lwk",
    defaultMessage: "Settings",
    description: "settings menu item",
  },
  bulkIssue: {
    id: "9hab/1",
    defaultMessage: "Bulk Issue",
    description: "bulk issue menu item",
  },
  exportCodes: {
    id: "exvX+Z",
    defaultMessage: "Export card codes",
    description: "export card codes menu item",
  },
  issueButtonLabel: {
    id: "RfPJ1E",
    defaultMessage: "Issue card",
    description: "issue card button label",
  },
  noGiftCardsAlertTitle: {
    id: "E22x4H",
    defaultMessage: "You haven’t defined a gift card product!",
    description: "no card defuned alert message",
  },
  noGiftCardsProductsAndProductTypes: {
    id: "U9o2bV",
    defaultMessage:
      "{createGiftCardProductType} and {giftCardProduct} to start selling gift cards in your store.",
    description: "no gift card products and types alert message",
  },
  noGiftCardsProductTypes: {
    id: "VI+X8H",
    defaultMessage:
      "{createGiftCardProductType} to start selling gift cards in your store.",
    description: "no gift card product types alert message",
  },
  noGiftCardsProducts: {
    id: "jmh0rV",
    defaultMessage:
      "{createGiftCardProduct} to start selling gift cards in your store.",
    description: "no gift card products alert message",
  },
  createGiftCardProductType: {
    id: "8Hq18g",
    defaultMessage: "Create a gift card product type",
    description: "create gift card product type alert message",
  },
  createGiftCardProduct: {
    id: "HqeqEV",
    defaultMessage: "Create a gift card product",
    description: "create gift card product alert message",
  },
  giftCardProduct: {
    id: "AJgl5u",
    defaultMessage: "gift card product",
    description: "gift card product message",
  },
});

export const giftCardsListTableMessages = defineMessages({
  giftCardsTableColumnGiftCardTitle: {
    id: "eLJQSh",
    defaultMessage: "Gift Card",
    description: "column title gift card",
  },
  giftCardsTableColumnTagTitle: {
    id: "FEWgh/",
    defaultMessage: "Tag",
    description: "column title tag",
  },
  giftCardsTableColumnProductTitle: {
    id: "bwJc6V",
    defaultMessage: "Product",
    description: "column title product",
  },
  giftCardsTableColumnCustomerTitle: {
    id: "MJBAqv",
    defaultMessage: "Used by",
    description: "column title used by/customer",
  },
  giftCardsTableColumnBalanceTitle: {
    id: "MbZHXE",
    defaultMessage: "Balance",
    description: "column title balance",
  },
  codeEndingWithLabel: {
    id: "38dS1A",
    defaultMessage: "Code ending with {last4CodeChars}",
    description: "code ending with label",
  },
  noGiftCardsFound: {
    id: "Rd0s80",
    defaultMessage: "No gift cards found",
    description: "no cards found title message",
  },
});

export const giftCardUpdateFormMessages = defineMessages({
  giftCardInvalidExpiryDateHeader: {
    id: "l1/Hwb",
    defaultMessage: "Incorrect date entered",
    description: "invalid date in expirydate field header",
  },
  giftCardInvalidExpiryDateContent: {
    id: "rCy3Fe",
    defaultMessage: "Gift Card with past expiration date cannot be created",
    description: "invalid date in expirydate field content",
  },
});
