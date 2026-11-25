import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "d8moXY",
    defaultMessage: "Model metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "5ZQt4d",
    defaultMessage:
      "Model metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "E80hZW",
    defaultMessage:
      "Model metadata has moved from the bottom of the model page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
    description: "ripple description in What's New",
  },
});

export const rippleModelMetadata: Ripple = {
  type: "improvement",
  ID: "model-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 12),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
