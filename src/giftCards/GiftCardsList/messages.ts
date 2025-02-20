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

export const bulkEnableDisableSectionMessages = defineMessages({
  enableLabel: {
    id: "hz+9ES",
    defaultMessage: "Activate",
    description: "bulk activate label",
  },
  disableLabel: {
    id: "IzEVek",
    defaultMessage: "Deactivate",
    description: "bulk disable label",
  },
  deleteLabel: {
    id: "qkt/Km",
    defaultMessage: "Delete",
    description: "bulk delete label",
  },
  successActivateAlertText: {
    id: "IwEQvz",
    defaultMessage: "Successfully activated gift {count,plural,one{card} other{cards}}",
    description: "success activate alert message",
  },
  successDeactivateAlertText: {
    id: "SO56cv",
    defaultMessage: "Successfully deactivated gift {count,plural,one{card} other{cards}}",
    description: "success deactivate alert message",
  },
  errorActivateAlertText: {
    id: "KcsJKm",
    defaultMessage: "Error activating gift {count,plural,one{card} other{cards}}",
    description: "error with activatation alert message",
  },
  errorDeactivateAlertText: {
    id: "C90nKP",
    defaultMessage: "Errors deactivating gift {count,plural,one{card} other{cards}}",
    description: "error with deactivatation alert message",
  },
});
