import { PluginBaseFragmentFragment } from "@saleor/graphql";
import { Pill } from "@saleor/macaw-ui";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import React from "react";
import { useIntl } from "react-intl";

import { pluginStatusMessages } from "./messages";
import { pluginAvailabilityStatusMessages as messages } from "./messages";
import { getActiveChannelConfigsCount } from "./utils";

interface PluginAvailabilityStatusProps {
  plugin: PluginBaseFragmentFragment;
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
