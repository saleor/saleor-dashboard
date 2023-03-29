import { Channel as ChannelList, ChannelData } from "@dashboard/channels/utils";
import { PermissionEnum } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { RequireOnlyOne } from "@dashboard/misc";
import { Box, Divider, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import {
  ChannelAvailabilityItemContent,
  ChannelAvailabilityItemWrapper,
} from "./Channel";
import {
  ChannelsAvailabilityCardWrapper,
  ChannelsAvailabilityWrapperProps,
} from "./ChannelsAvailabilityCardWrapper";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "./types";
import { getChannelsAvailabilityMessages } from "./utils";

export interface ChannelsAvailability
  extends Omit<
    ChannelsAvailabilityWrapperProps,
    "children" | "selectedChannelsCount"
  > {
  channels: ChannelData[];
  /** Channels that have no settings */
  channelsList: ChannelList[];
  errors?: ChannelsAvailabilityError[];
  disabled?: boolean;
  messages?: Messages;
  managePermissions: PermissionEnum[];
  onChange?: (id: string, data: ChannelOpts) => void;
}

export type ChannelsAvailabilityCardProps = RequireOnlyOne<
  ChannelsAvailability,
  "channels" | "channelsList"
>;

export const ChannelsAvailability: React.FC<
  ChannelsAvailabilityCardProps
> = props => {
  const {
    channelsList,
    errors = [],
    allChannelsCount = 0,
    channels,
    messages,
    managePermissions,
    onChange,
    openModal,
  } = props;
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const channelsMessages = getChannelsAvailabilityMessages({
    messages,
    channels,
    intl,
    localizeDate,
  });

  return (
    <ChannelsAvailabilityCardWrapper
      selectedChannelsCount={(channels ?? channelsList).length ?? 0}
      allChannelsCount={allChannelsCount}
      managePermissions={managePermissions}
      openModal={openModal}
    >
      {channels
        ? channels.map(data => {
            const channelErrors =
              errors?.filter(error => error.channels.includes(data.id)) || [];

            return (
              <ChannelAvailabilityItemWrapper
                messages={messages}
                data={data}
                key={data.id}
              >
                <ChannelAvailabilityItemContent
                  data={data}
                  onChange={onChange}
                  messages={channelsMessages[data.id]}
                  errors={channelErrors}
                />
              </ChannelAvailabilityItemWrapper>
            );
          })
        : channelsList
        ? channelsList.map(data => (
            <React.Fragment key={data.id}>
              <Box>
                <Text>{data.name}</Text>
              </Box>
              <Divider />
            </React.Fragment>
          ))
        : null}
    </ChannelsAvailabilityCardWrapper>
  );
};

export default ChannelsAvailability;
