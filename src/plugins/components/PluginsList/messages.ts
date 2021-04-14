import { defineMessages } from "react-intl";

export const pluginAvailabilityStatusMessages = defineMessages({
  globalTitle: {
    defaultMessage: "Global plugin",
    description: "plugin global availability status title"
  },
  channelTitle: {
    defaultMessage: "Assigned to {activeChannelsCount}",
    description: "plugin channel availability status title"
  }
});

export const channelConfigPluginMessages = defineMessages({
  title: {
    defaultMessage:
      "Assigned to {activeChannelsCount} of {allChannelsCount} channels",
    description: "channel config plugin status popup title"
  }
});

export const globalConfigPluginMessages = defineMessages({
  title: {
    defaultMessage: "Global Plugin",
    description: "global config plugin status popup title"
  },
  description: {
    defaultMessage:
      "Global plugins are set across all channels in your ecommerce. Only status is shown for those types of plugins",
    description: "global config plugin status popup description"
  }
});
