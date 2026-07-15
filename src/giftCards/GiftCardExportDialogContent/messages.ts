import { defineMessages } from "react-intl";

export const giftCardExportDialogMessages = defineMessages({
  title: {
    id: "nzycaQ",
    defaultMessage: "Export gift cards",
    description: "gift card export dialog title",
  },
  description: {
    id: "NSOHa/",
    defaultMessage:
      "Choose which gift cards to export and the file format. Only active, unused gift cards are included.",
    description: "gift card export dialog intro",
  },
  descriptionSelectedOnly: {
    id: "qU6l9V",
    defaultMessage:
      "Choose the file format for the selected gift cards. Only active, unused gift cards are included.",
    description: "gift card export dialog intro when exporting preselected cards",
  },
  allGiftCards: {
    id: "a6cSKQ",
    defaultMessage: "All gift cards ({number})",
    description: "export all gift cards scope option",
  },
  selectedGiftCards: {
    id: "lkqgNs",
    defaultMessage: "Selected gift cards ({number})",
    description: "export selected gift cards scope option",
  },
  confirmButtonLabel: {
    id: "CRAfpd",
    defaultMessage: "Export codes",
    description: "gift card export dialog confirm button label",
  },
  successAlertDescription: {
    id: "bDHiYK",
    defaultMessage:
      "We are currently exporting your gift card codes. As soon as your file is available it will be sent to your email address",
    description: "gift card export success alert description",
  },
  successAlertTitle: {
    id: "YEpYMB",
    defaultMessage: "Exporting CSV",
    description: "gift card export csv success alert title",
  },
});
