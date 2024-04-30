// @ts-strict-ignore
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { CollectionFragment } from "@dashboard/graphql";
import ScrollableContent from "@dashboard/plugins/components/PluginsList/PluginAvailabilityStatusPopup/ScrollableContent";
import { Typography } from "@material-ui/core";
import { PillColor } from "@saleor/macaw-ui";
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
        <Typography variant="caption" className={classes.caption}>
          {intl.formatMessage(messages.channel)}
        </Typography>
        <Typography variant="caption" className={classes.caption}>
          {intl.formatMessage(messages.status)}
        </Typography>
      </div>
      <ScrollableContent>
        {pills.map(pill => (
          <div key={pill.channel.id} className={classes.row}>
            <Typography>{pill.channel.name}</Typography>
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
