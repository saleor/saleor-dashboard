import { defineMessages } from "react-intl";

export const pluginAvailabilityStatusMessages = defineMessages({
  channelTitle: {
    defaultMessage: "Active in {activeChannelsCount}",
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
    description: "global config plugin status popup title",
    id: "globalConfigPluginMessages title"
  },
  description: {
    defaultMessage:
      "Global plugins are set across all channels in your ecommerce. Only status is shown for those types of plugins",
    description: "global config plugin status popup description"
  }
});

export const pluginsListTableHeadMessages = defineMessages({
  nameLabel: {
    defaultMessage: "Name",
    description: "table header name col label"
  },
  confLabel: {
    defaultMessage: "Configuration",
    description: "table header configuration col label"
  },
  channelLabel: {
    defaultMessage: "Channel",
    description: "table header channel col label"
  }
});

export const pluginChannelConfigurationCellMessages = defineMessages({
  globalLabel: {
    defaultMessage: "Global",
    description: "PluginChannelConfigurationCell global title"
  },
  channelLabel: {
    defaultMessage: "Per channel",
    description: "PluginChannelConfigurationCell channel title",
    id: "pluginChannelConfigurationCellMessages per channel"
  }
});
