// @ts-strict-ignore
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { CollectionFragment } from "@dashboard/graphql";
import ScrollableContent from "@dashboard/plugins/components/PluginsList/PluginAvailabilityStatusPopup/ScrollableContent";
import { PillColor } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { messages } from "../ChannelsAvailabilityDropdown/messages";
import { Pill } from "../Pill";
import { useStyles } from "./styles";

export interface ChannelsAvailabilityMenuContentProps {
  pills: Pill[];
}
export interface Pill {
  channel: CollectionFragment["channelListings"][0]["channel"];
  color: PillColor;
  label: MessageDescriptor;
}

export const ChannelsAvailabilityMenuContent: React.FC<ChannelsAvailabilityMenuContentProps> = ({
  pills,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.menuContainer}>
      <div className={classes.row}>
        <Text size={2} fontWeight="light" className={classes.caption}>
          {intl.formatMessage(messages.channel)}
        </Text>
        <Text size={2} fontWeight="light" className={classes.caption}>
          {intl.formatMessage(messages.status)}
        </Text>
      </div>
      <ScrollableContent>
        {pills.map(pill => (
          <div key={pill.channel.id} className={classes.row}>
            <Text>{pill.channel.name}</Text>
            <HorizontalSpacer spacing={4} />
            <Pill label={intl.formatMessage(pill.label)} color={pill.color} />
          </div>
        ))}
      </ScrollableContent>
    </div>
  );
};
ChannelsAvailabilityMenuContent.displayName = "ChannelsAvailabilityMenuContent";
export default ChannelsAvailabilityMenuContent;
