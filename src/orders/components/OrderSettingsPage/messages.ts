import { defineMessages } from "react-intl";

export const orderSettingsPageMessages = defineMessages({
  channelSaveFailed: {
    id: "/ayo3Z",
    defaultMessage: "Could not save channel settings for: {channels}",
    description: "error when channel order settings fail to save from orders hub",
  },
  partialSaveFailed: {
    id: "+S0U0R",
    defaultMessage: "Some order settings could not be saved. Review the form and try again.",
    description: "error when both shop and channel saves partially fail on orders hub",
  },
});
