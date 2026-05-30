import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "yQBnJm",
    defaultMessage: "Bulk order import",
    description: "dialog header",
  },
  description: {
    id: "uRnkBf",
    defaultMessage:
      "Upload a CSV of B2B order lines. Each unique order_ref becomes one confirmed Saleor order. You will receive an email with the per-order result when the import finishes.",
    description: "dialog body description",
  },
  channelLabel: {
    id: "cEoA5A",
    defaultMessage: "Channel",
    description: "preselected channel label",
  },
  fileLabel: {
    id: "VDMaX1",
    defaultMessage: "CSV file",
    description: "file input label",
  },
  notifyEmailLabel: {
    id: "yWuaxm",
    defaultMessage: "Result email (optional)",
    description: "notification email input label",
  },
  notifyEmailHint: {
    id: "rw3mPU",
    defaultMessage:
      "Where to send the per-order result. Leave blank to use the default ops mailing list.",
    description: "notification email helper text",
  },
  submit: {
    id: "K/B+CK",
    defaultMessage: "Start import",
    description: "submit button",
  },
  ackTitle: {
    id: "HkD+ng",
    defaultMessage: "Import accepted",
    description: "success state title",
  },
});
