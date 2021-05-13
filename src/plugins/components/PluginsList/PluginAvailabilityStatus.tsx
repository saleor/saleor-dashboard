import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StatusLabel from "@saleor/components/StatusLabel";
import { statusLabelMessages } from "@saleor/components/StatusLabel/messages";
import { Plugins_plugins_edges_node } from "@saleor/plugins/types/Plugins";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import React from "react";
import { useIntl } from "react-intl";

import { pluginAvailabilityStatusMessages as messages } from "./messages";
import {
  getActiveChannelConfigsCount,
  getAllChannelConfigsCount
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

interface PluginAvailabilityStatusProps {
  plugin: Plugins_plugins_edges_node;
}

const PluginAvailabilityStatus: React.FC<PluginAvailabilityStatusProps> = ({
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

  const globalPluginLabel = intl.formatMessage(
    isStatusActive
      ? statusLabelMessages.active
      : statusLabelMessages.deactivated
  );

  return (
    <StatusLabel
      label={
        isGlobalPlugin ? (
          globalPluginLabel
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

export default PluginAvailabilityStatus;
