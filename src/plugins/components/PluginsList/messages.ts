import { defineMessages } from "react-intl";

export const pluginAvailabilityStatusMessages = defineMessages({
  channelTitle: {
    id: "HedXnw",
    defaultMessage:
      "{activeChannelsCount,plural, =0 {Deactivated} other {Active in {activeChannelsCount}}}",
    description: "plugin channel availability status title",
  },
});

export const channelConfigPluginMessages = defineMessages({
  title: {
    id: "8u7els",
    defaultMessage:
      "Assigned to {activeChannelsCount} of {allChannelsCount} channels",
    description: "channel config plugin status popup title",
  },
});

export const globalConfigPluginMessages = defineMessages({
  title: {
    id: "T4wa2Y",
    defaultMessage: "Global Plugin",
    description: "global config plugin status popup title",
  },
  description: {
    id: "reP5Uf",
    defaultMessage:
      "Global plugins are set across all channels in your ecommerce. Only status is shown for those types of plugins",
    description: "global config plugin status popup description",
  },
});

export const pluginsListTableHeadMessages = defineMessages({
  nameLabel: {
    id: "QH74y5",
    defaultMessage: "Name",
    description: "table header name col label",
  },
  confLabel: {
    id: "AijtXU",
    defaultMessage: "Configuration",
    description: "table header configuration col label",
  },
  channelLabel: {
    id: "ycrTBX",
    defaultMessage: "Channel",
    description: "table header channel col label",
  },
});

export const pluginChannelConfigurationCellMessages = defineMessages({
  globalLabel: {
    id: "xTIKA/",
    defaultMessage: "Global",
    description: "PluginChannelConfigurationCell global title",
  },
  channelLabel: {
    id: "gz9v22",
    defaultMessage: "Per channel",
    description: "PluginChannelConfigurationCell channel title",
  },
});

export const pluginStatusMessages = defineMessages({
  active: {
    id: "rQOS7K",
    defaultMessage: "Active",
    description: "status label active",
  },
  deactivated: {
    id: "ho75Lr",
    defaultMessage: "Deactivated",
    description: "status label deactivated",
  },
});
