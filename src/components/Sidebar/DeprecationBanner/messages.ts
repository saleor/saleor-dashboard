import { defineMessages } from "react-intl";

export const deprecationBannerMessages = defineMessages({
  message: {
    id: "EaM4Ss",
    defaultMessage:
      "This Saleor version is deprecated and will be automatically upgraded on {date}. Your store may stop working. Upgrade or contact Saleor support immediately.",
    description: "deprecation banner shown in the sidebar",
  },
});
