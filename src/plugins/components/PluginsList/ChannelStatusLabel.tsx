import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Channels_channels } from "@saleor/channels/types/Channels";
import StatusLabel from "@saleor/components/StatusLabel";
import { Plugins_plugins_edges_node } from "@saleor/plugins/types/Plugins";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    horizontalContainer: {
      display: "flex",
      flexDirection: "row"
    }
  }),
  { name: "ChannelStatusLabel" }
);

import { channelStatusLabelMessages as messages } from "./messages";

interface ChannelStatusLabelProps {
  plugin: Plugins_plugins_edges_node;
  channels: Channels_channels[];
}

const ChannelStatusLabel: React.FC<ChannelStatusLabelProps> = ({
  plugin: { globalConfiguration, channelConfigurations }
}) => {
  const classes = useStyles({});
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
          <div className={classes.horizontalContainer}>
            <Typography>
              {intl.formatMessage(messages.channelTitle, {
                activeChannelsCount
              })}
            </Typography>
            <Typography color="textSecondary">{`/${allChannelsCount}`}</Typography>
          </div>
        )
      }
      status={isStatusActive ? "success" : "error"}
    />
  );
};

export default ChannelStatusLabel;
