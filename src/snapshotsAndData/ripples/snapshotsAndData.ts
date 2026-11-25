import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "pmYaDE",
    defaultMessage: "Snapshots and data",
    description: "ripple title",
  },
  contextual: {
    id: "Xdhq/a",
    defaultMessage:
      "Create and restore this environment's snapshots, or start its data afresh, without leaving the Dashboard.",
    description: "ripple contextual hint",
  },
  global: {
    id: "iYmhCb",
    defaultMessage:
      "If you sign in with Saleor Cloud, Configuration → Snapshots and data lists this environment's snapshots. Create one, restore from it or from any snapshot in your organization, replace the data with a sample store, or clear its orders or its whole database. Actions your Saleor Cloud role doesn't allow are disabled with the reason.",
    description: "ripple description in What's New",
  },
});

export const rippleSnapshotsAndData: Ripple = {
  type: "feature",
  ID: "cloud-snapshots-and-data",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 10, 20),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
