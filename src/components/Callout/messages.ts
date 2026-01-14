import { defineMessages } from "react-intl";

// Re-export common messages for backward compatibility
// TODO: Remove and use `commonMessages` from @dashboard/intl
export const calloutTitleMessages = defineMessages({
  info: {
    defaultMessage: "Info",
    description: "callout, title",
    id: "BnB/7Y",
  },
  warning: {
    defaultMessage: "Warning",
    description: "callout, title",
    id: "UUVUyy",
  },
});
