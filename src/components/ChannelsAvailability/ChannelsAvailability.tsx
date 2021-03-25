import Typography from "@material-ui/core/Typography";
import { Channel as ChannelList, ChannelData } from "@saleor/channels/utils";
import Hr from "@saleor/components/Hr";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { RequireOnlyOne } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import ChannelContent from "./ChannelContent";
import ChannelContentWrapper from "./ChannelContentWrapper";
import ChannelsAvailabilityWrapper, {
  ChannelsAvailabilityWrapperProps
} from "./ChannelsAvailabilityWrapper";
import { useStyles } from "./styles";
import { ChannelsAvailabilityError, ChannelValue, Message } from "./types";
import { getChannelsAvailabilityMessages } from "./utils";

export interface ChannelsAvailability
  extends Omit<ChannelsAvailabilityWrapperProps, "children"> {
  channels: ChannelData[];
  channelsList: ChannelList[];
  errors?: ChannelsAvailabilityError[];
  disabled?: boolean;
  messages: Message;
  onChange?: (id: string, data: ChannelValue) => void;
}

export type ChannelsAvailabilityProps = RequireOnlyOne<
  ChannelsAvailability,
  "channels" | "channelsList"
>;

export const ChannelsAvailability: React.FC<ChannelsAvailabilityProps> = props => {
  const {
    channelsList,
    errors = [],
    selectedChannelsCount,
    allChannelsCount,
    channels,
    messages,
    onChange,
    openModal
  } = props;
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const classes = useStyles({});

  const channelsMessages = getChannelsAvailabilityMessages({
    messages,
    channels,
    intl,
    localizeDate
  });

  return (
    <ChannelsAvailabilityWrapper
      selectedChannelsCount={selectedChannelsCount}
      allChannelsCount={allChannelsCount}
      openModal={openModal}
    >
      {channels
        ? channels.map(data => {
            const channelErrors =
              errors?.filter(error => error.channels.includes(data.id)) || [];

            return (
              <ChannelContentWrapper messages={messages} data={data}>
                <ChannelContent
                  data={data}
                  onChange={onChange}
                  messages={channelsMessages[data.id]}
                  errors={channelErrors}
                />
              </ChannelContentWrapper>
            );
          })
        : channelsList
        ? channelsList.map(data => (
            <React.Fragment key={data.id}>
              <div className={classes.channelItem}>
                <div className={classes.channelName}>
                  <Typography>{data.name}</Typography>
                </div>
              </div>
              <Hr className={classes.hr} />
            </React.Fragment>
          ))
        : null}
    </ChannelsAvailabilityWrapper>
  );
};

export default ChannelsAvailability;
