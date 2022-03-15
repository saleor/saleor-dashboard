import { Pill } from "@saleor/macaw-ui";
import { Plugins_plugins_edges_node } from "@saleor/plugins/types/Plugins";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import React from "react";
import { useIntl } from "react-intl";

import { pluginStatusMessages } from "./messages";
import { pluginAvailabilityStatusMessages as messages } from "./messages";
import { getActiveChannelConfigsCount } from "./utils";

interface PluginAvailabilityStatusProps {
  plugin: Plugins_plugins_edges_node;
}

const PluginAvailabilityStatus: React.FC<PluginAvailabilityStatusProps> = ({
  plugin: { globalConfiguration, channelConfigurations }
}) => {
  const intl = useIntl();

  const isGlobalPlugin = isPluginGlobal(globalConfiguration);

  const activeChannelsCount = getActiveChannelConfigsCount(
    channelConfigurations
  );

  const isStatusActive = isGlobalPlugin
    ? globalConfiguration.active
    : !!activeChannelsCount;

  const globalPluginLabel = intl.formatMessage(
    isStatusActive
      ? pluginStatusMessages.active
      : pluginStatusMessages.deactivated
  );

  return (
    <Pill
      label={
        isGlobalPlugin
          ? globalPluginLabel
          : intl.formatMessage(messages.channelTitle, {
              activeChannelsCount
            })
      }
      color={isStatusActive ? "success" : "error"}
      outlined
    />
  );
};

export default PluginAvailabilityStatus;
