import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StatusLabel from "@saleor/components/StatusLabel";
import { Plugins_plugins_edges_node } from "@saleor/plugins/types/Plugins";
import React from "react";
import { useIntl } from "react-intl";

import { pluginAvailabilityStatusMessages as messages } from "./messages";
import {
  getActiveChannelConfigsCount,
  getAllChannelConfigsCount,
  isPluginGlobal
} from "./utils";

const useStyles = makeStyles(
  () => ({
    horizontalContainer: {
      display: "flex",
      flexDirection: "row"
    }
  }),
  { name: "ChannelStatusLabel" }
);

interface ChannelStatusLabelProps {
  plugin: Plugins_plugins_edges_node;
}

const ChannelStatusLabel: React.FC<ChannelStatusLabelProps> = ({
  plugin: { globalConfiguration, channelConfigurations }
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const isGlobalPlugin = isPluginGlobal(globalConfiguration);

  const activeChannelsCount = getActiveChannelConfigsCount(
    channelConfigurations
  );

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
            <Typography color="textSecondary">{`/${getAllChannelConfigsCount(
              channelConfigurations
            )}`}</Typography>
          </div>
        )
      }
      status={isStatusActive ? "success" : "error"}
    />
  );
};

export default ChannelStatusLabel;
