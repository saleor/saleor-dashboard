import { defineMessages } from "react-intl";

export const deprecationBannerMessages = defineMessages({
  title: {
    id: "3XDi5q",
    defaultMessage: "Action required: Saleor upgrade required",
    description: "deprecation banner title shown in the sidebar",
  },
  message: {
    id: "plJ8R3",
    defaultMessage:
      "This Saleor version is deprecated and scheduled for automatic upgrade on {date}. To avoid disruption to your store operations, please upgrade immediately or contact Saleor Support for urgent assistance.",
    description: "deprecation banner shown in the sidebar",
  },
});
