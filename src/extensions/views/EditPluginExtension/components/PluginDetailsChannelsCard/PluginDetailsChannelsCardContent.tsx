// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CollectionWithDividers from "@dashboard/components/CollectionWithDividers";
import { PluginsDetailsFragment } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Chip, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getPluginStatusColor, getPluginStatusLabel, isPluginGlobal } from "../../utils";
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

function mapPluginStatusToChipColor(status: string): "success1" | "critical1" | "default1" {
  switch (status) {
    case "success":
      return "success1";
    case "error":
      return "critical1";
    default:
      return "default1";
  }
}

export const PluginDetailsChannelsCardContent: React.FC<PluginDetailsChannelsCardProps> = ({
  plugin,
  selectedChannelId,
  setSelectedChannelId,
}) => {
  const intl = useIntl();
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
        renderItem={channel => (
          <div
            data-test-id="channel"
            className={classes.itemContainer}
            key={channel.channel.id}
            onClick={() => setSelectedChannelId(channel.channel.id)}
          >
            {isChannelSelected(channel.channel.id) && (
              <div className={classes.itemActiveIndicator}></div>
            )}
            <DashboardCard.Content padding={4} display="flex" alignItems="center" gap={2}>
              <Text>{channel.channel.name}</Text>
              <Chip backgroundColor={mapPluginStatusToChipColor(getPluginStatusColor(channel))}>
                {intl.formatMessage(getPluginStatusLabel(channel))}
              </Chip>
            </DashboardCard.Content>
          </div>
        )}
      />
    </>
  );
};
