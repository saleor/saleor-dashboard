import { defineMessages } from "react-intl";

export const giftCardsListHeaderMenuItemsMessages = defineMessages({
  settings: {
    defaultMessage: "Settings",
    description: "GiftCardsListHeader menu item settings"
  },
  bulkIssue: {
    defaultMessage: "Bulk Issue",
    description: "GiftCardsListHeader menu item settings"
  },
  exportCodes: {
    defaultMessage: "Export card codes",
    description: "GiftCardsListHeader menu item settings"
  },
  issueButtonLabel: {
    defaultMessage: "Issue card",
    description: "GiftCardsListHeader issue button label"
  },
  noGiftCardsAlertTitle: {
    defaultMessage: "You haven’t defined a gift card product!",
    description: "GiftCardsListHeader alert"
  },
  noGiftCardsProductsAndProductTypes: {
    defaultMessage:
      "{createGiftCardProductType} and {giftCardProduct} to start selling gift cards in your store.",
    description: "GiftCardsListHeader alert"
  },
  noGiftCardsProductTypes: {
    defaultMessage:
      "{createGiftCardProductType} to start selling gift cards in your store.",
    description: "GiftCardsListHeader alert"
  },
  noGiftCardsProducts: {
    defaultMessage:
      "{createGiftCardProduct} to start selling gift cards in your store.",
    description: "GiftCardsListHeader alert"
  },
  createGiftCardProductType: {
    defaultMessage: "Create a gift card product type",
    description: "GiftCardsListHeader alert"
  },
  createGiftCardProduct: {
    defaultMessage: "Create a gift card product",
    description: "GiftCardsListHeader alert"
  },
  giftCardProduct: {
    defaultMessage: "gift card product",
    description: "GiftCardsListHeader alert"
  }
});

export const giftCardsListTableMessages = defineMessages({
  giftCardsTableColumnGiftCardTitle: {
    defaultMessage: "Gift Card",
    description: "GiftCardsListTable column title gift card"
  },
  giftCardsTableColumnTagTitle: {
    defaultMessage: "Tag",
    description: "GiftCardsListTable column title tag"
  },
  giftCardsTableColumnProductTitle: {
    defaultMessage: "Product",
    description: "GiftCardsListTable column title product"
  },
  giftCardsTableColumnCustomerTitle: {
    defaultMessage: "Used by",
    description: "GiftCardsListTable column title customer"
  },
  giftCardsTableColumnBalanceTitle: {
    defaultMessage: "Balance",
    description: "GiftCardsListTable column title balance"
  },
  codeEndingWithLabel: {
    defaultMessage: "Code ending with {displayCode}",
    description: "GiftCardsListTable code ending with label"
  },
  noGiftCardsFound: {
    defaultMessage: "No gift cards found",
    description: "GiftCardsListTable no cards found title"
  }
});
