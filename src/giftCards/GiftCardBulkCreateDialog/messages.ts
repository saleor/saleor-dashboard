import { defineMessages } from "react-intl";

export const giftCardBulkCreateDialogMessages = defineMessages({
  title: {
    id: "da4+d5",
    defaultMessage: "Bulk issue gift cards",
    description: "bulk issue gift cards dialog title",
  },
  description: {
    id: "0o9VGr",
    defaultMessage:
      "Set how many gift cards to issue and their value. After creation, you can download the list of codes.",
    description: "bulk issue gift cards dialog intro",
  },
  cardsToIssueSection: {
    id: "j5r4iT",
    defaultMessage: "Gift cards to issue",
    description: "bulk issue gift cards quantity section header",
  },
  optionsSection: {
    id: "Szr2Je",
    defaultMessage: "Options",
    description: "bulk issue gift cards settings section header",
  },
  createdSuccessAlertTitle: {
    id: "3bQz2o",
    defaultMessage: "Gift Cards Issued",
    description: "bulk issue gift cards success alert title",
  },
  createdSuccessAlertDescription: {
    id: "a/x3DZ",
    defaultMessage: "{cardsAmount} gift cards issued",
    description: "bulk issue gift cards success alert description",
  },
  successTitle: {
    id: "slmhRQ",
    defaultMessage: "Gift cards issued",
    description: "gift card bulk create success dialog title",
  },
  successDescription: {
    id: "qJ6D+G",
    defaultMessage:
      "Your gift cards are ready. Export the codes to your email to download the list.",
    description: "gift card bulk create success dialog content",
  },
  successExportToEmail: {
    id: "Ui4GxI",
    defaultMessage: "Export to email",
    description: "gift card bulk create success dialog export button",
  },
  successClose: {
    id: "vNRe6t",
    defaultMessage: "Done",
    description: "gift card bulk create success dialog accept button",
  },
});
