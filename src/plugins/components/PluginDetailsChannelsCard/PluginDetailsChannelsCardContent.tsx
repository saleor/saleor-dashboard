// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CollectionWithDividers from "@dashboard/components/CollectionWithDividers";
import { PluginsDetailsFragment } from "@dashboard/graphql";
import { isPluginGlobal } from "@dashboard/plugins/views/utils";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { pluginDetailsChannelsCardMessages as messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    itemContainer: {
      position: "relative",
      cursor: "pointer",
    },
    itemActiveIndicator: {
      position: "absolute",
      left: 0,
      backgroundColor: theme.palette.primary.main,
      width: 2,
      height: "100%",
    },
  }),
  { name: "PluginDetailsChannelsCardContent" },
);

export interface PluginDetailsChannelsCardProps {
  setSelectedChannelId: (channelId: string) => void;
  selectedChannelId: string;
  plugin: PluginsDetailsFragment;
}

const PluginDetailsChannelsCardContent: React.FC<PluginDetailsChannelsCardProps> = ({
  plugin,
  selectedChannelId,
  setSelectedChannelId,
}) => {
  const classes = useStyles({});

  if (!plugin) {
    return (
      <DashboardCard.Content>
        <Skeleton />
      </DashboardCard.Content>
    );
  }

  if (isPluginGlobal(plugin.globalConfiguration)) {
    return (
      <DashboardCard.Content>
        <Text>
          <FormattedMessage {...messages.noChannelsSubtitle} />
        </Text>
      </DashboardCard.Content>
    );
  }

  const isChannelSelected = (channelId: string) => selectedChannelId === channelId;

  return (
    <>
      <CollectionWithDividers
        collection={plugin.channelConfigurations}
        renderItem={({ channel }) => (
          <div
            data-test-id="channel"
            className={classes.itemContainer}
            key={channel.id}
            onClick={() => setSelectedChannelId(channel.id)}
          >
            {isChannelSelected(channel.id) && <div className={classes.itemActiveIndicator}></div>}
            <DashboardCard.Content padding={4}>
              <Text>{channel.name}</Text>
            </DashboardCard.Content>
          </div>
        )}
      />
    </>
  );
};

export default PluginDetailsChannelsCardContent;
