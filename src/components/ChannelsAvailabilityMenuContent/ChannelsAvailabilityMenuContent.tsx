import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Pill, PillColor } from "@saleor/macaw-ui";
import ScrollableContent from "@saleor/plugins/components/PluginsList/PluginAvailabilityStatusPopup/ScrollableContent";
import React from "react";
import { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";

import { messages } from "../ChannelsAvailabilityDropdown/messages";
import { Channels } from "../ChannelsAvailabilityDropdown/utils";
import { useStyles } from "./styles";

export interface ChannelsAvailabilityMenuContentProps {
  channels: Channels[];
  labelFunction: (channelData: unknown) => MessageDescriptor;
  colorFunction: (channelData: unknown) => PillColor;
}

export const ChannelsAvailabilityMenuContent: React.FC<ChannelsAvailabilityMenuContentProps> = ({
  channels,
  labelFunction,
  colorFunction
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
        {channels.map(channelData => (
          <div key={channelData.channel.id} className={classes.row}>
            <Typography>{channelData.channel.name}</Typography>
            <HorizontalSpacer spacing={4} />
            <Pill
              label={intl.formatMessage(labelFunction(channelData))}
              color={colorFunction(channelData)}
            />
          </div>
        ))}
      </ScrollableContent>
    </div>
  );
};
ChannelsAvailabilityMenuContent.displayName = "ChannelsAvailabilityMenuContent";
export default ChannelsAvailabilityMenuContent;
