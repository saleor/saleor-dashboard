import { defineMessages } from "react-intl";

export const giftCardsListHeaderMenuItemsMessages = defineMessages({
  settings: {
    defaultMessage: "Settings",
    description: "settings menu item"
  },
  bulkIssue: {
    defaultMessage: "Bulk Issue",
    description: "bulk issue menu item"
  },
  exportCodes: {
    defaultMessage: "Export card codes",
    description: "export card codes menu item"
  },
  issueButtonLabel: {
    defaultMessage: "Issue card",
    description: "issue card button label"
  },
  noGiftCardsAlertTitle: {
    defaultMessage: "You haven’t defined a gift card product!",
    description: "no card defuned alert message"
  },
  noGiftCardsProductsAndProductTypes: {
    defaultMessage:
      "{createGiftCardProductType} and {giftCardProduct} to start selling gift cards in your store.",
    description: "no gift card products and types alert message"
  },
  noGiftCardsProductTypes: {
    defaultMessage:
      "{createGiftCardProductType} to start selling gift cards in your store.",
    description: "no gift card product types alert message"
  },
  noGiftCardsProducts: {
    defaultMessage:
      "{createGiftCardProduct} to start selling gift cards in your store.",
    description: "no gift card products alert message"
  },
  createGiftCardProductType: {
    defaultMessage: "Create a gift card product type",
    description: "create gift card product type alert message"
  },
  createGiftCardProduct: {
    defaultMessage: "Create a gift card product",
    description: "create gift card product alert message"
  },
  giftCardProduct: {
    defaultMessage: "gift card product",
    description: "gift card product message"
  }
});

export const giftCardsListTableMessages = defineMessages({
  giftCardsTableColumnGiftCardTitle: {
    defaultMessage: "Gift Card",
    description: "column title gift card"
  },
  giftCardsTableColumnTagTitle: {
    defaultMessage: "Tag",
    description: "column title tag"
  },
  giftCardsTableColumnProductTitle: {
    defaultMessage: "Product",
    description: "column title product"
  },
  giftCardsTableColumnCustomerTitle: {
    defaultMessage: "Used by",
    description: "column title used by/customer"
  },
  giftCardsTableColumnBalanceTitle: {
    defaultMessage: "Balance",
    description: "column title balance"
  },
  codeEndingWithLabel: {
    defaultMessage: "Code ending with {last4CodeChars}",
    description: "code ending with label"
  },
  noGiftCardsFound: {
    defaultMessage: "No gift cards found",
    description: "no cards found title message"
  }
});

export const giftCardUpdateFormMessages = defineMessages({
  giftCardInvalidExpiryDateHeader: {
    defaultMessage: "Incorrect date entered",
    description: "invalid date in expirydate field header"
  },
  giftCardInvalidExpiryDateContent: {
    defaultMessage: "Gift Card with past expiration date cannot be created",
    description: "invalid date in expirydate field content"
  }
});
