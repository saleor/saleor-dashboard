import { Typography } from "@material-ui/core";
import { Channels_channels } from "@saleor/channels/types/Channels";
import StatusLabel from "@saleor/components/StatusLabel";
import { Plugins_plugins_edges_node } from "@saleor/plugins/types/Plugins";
import React from "react";
import { useIntl } from "react-intl";

import { channelStatusLabelMessages as messages } from "./messages";

interface ChannelStatusLabelProps {
  plugin: Plugins_plugins_edges_node;
  channels: Channels_channels[];
}

const ChannelStatusLabel: React.FC<ChannelStatusLabelProps> = ({
  plugin: { globalConfiguration, channelConfigurations }
}) => {
  const intl = useIntl();

  const isGlobalPlugin = !!globalConfiguration;

  const allChannelsCount = channelConfigurations?.length;
  const activeChannelsCount = channelConfigurations?.filter(
    ({ active }) => !!active
  ).length;

  const isStatusActive = isGlobalPlugin
    ? globalConfiguration.active
    : !!activeChannelsCount;

  return (
    <StatusLabel
      label={
        isGlobalPlugin ? (
          intl.formatMessage(messages.globalTitle)
        ) : (
          <>
            <Typography>
              {intl.formatMessage(messages.channelTitle, {
                activeChannelsCount
              })}
            </Typography>
            <Typography variant="caption">{allChannelsCount}</Typography>
          </>
        )
      }
      status={isStatusActive ? "success" : "error"}
    />
  );
};

export default ChannelStatusLabel;
