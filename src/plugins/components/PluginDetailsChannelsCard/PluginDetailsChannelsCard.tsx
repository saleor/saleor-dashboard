import {
  CardContent,
  Divider,
  makeStyles,
  Typography
} from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { renderCollectionWithDividers } from "@saleor/misc";
import { Plugin_plugin } from "@saleor/plugins/types/Plugin";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    itemContainer: {
      position: "relative",
      cursor: "pointer"
    },
    itemActiveIndicator: {
      position: "absolute",
      left: 0,
      backgroundColor: theme.palette.primary.main,
      width: 2,
      height: "100%"
    }
  }),
  { name: "PluginDetailsChannelsCard" }
);

interface PluginDetailsChannelsCardProps {
  setSelectedChannelId: (channelId: string) => void;
  selectedChannelId: string;
  plugin: Plugin_plugin;
}

import { pluginDetailsChannelsCardMessages as messages } from "./messages";
import PluginDetailsChannelsCardContainer from "./PluginDetailsChannelsCardContainer";

const PluginDetailsChannelsCard: React.FC<PluginDetailsChannelsCardProps> = ({
  plugin,
  selectedChannelId,
  setSelectedChannelId
}) => {
  const classes = useStyles({});

  if (!plugin) {
    return (
      <PluginDetailsChannelsCardContainer>
        <CardContent>
          <Skeleton />
        </CardContent>
      </PluginDetailsChannelsCardContainer>
    );
  }

  if (isPluginGlobal(plugin.globalConfiguration)) {
    return (
      <PluginDetailsChannelsCardContainer>
        <CardContent>
          <FormattedMessage {...messages.noChannelsSubtitle} />
        </CardContent>
      </PluginDetailsChannelsCardContainer>
    );
  }

  const isChannelSelected = (channelId: string) =>
    selectedChannelId === channelId;

  return (
    <PluginDetailsChannelsCardContainer>
      {renderCollectionWithDividers({
        collection: plugin.channelConfigurations,
        renderDivider: () => <Divider />,
        renderItem: ({ channel }) => (
          <div
            className={classes.itemContainer}
            key={channel.id}
            onClick={() => setSelectedChannelId(channel.id)}
          >
            {isChannelSelected(channel.id) && (
              <div className={classes.itemActiveIndicator}></div>
            )}
            <CardContent>
              <Typography>{channel.name}</Typography>
            </CardContent>
          </div>
        )
      })}
    </PluginDetailsChannelsCardContainer>
  );
};

export default PluginDetailsChannelsCard;
