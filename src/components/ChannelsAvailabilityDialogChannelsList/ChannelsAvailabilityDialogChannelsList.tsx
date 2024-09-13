import { Channel } from "@dashboard/channels/utils";
import { Box, Checkbox, Divider, Text } from "@saleor/macaw-ui-next";
import React from "react";

export interface ChannelsAvailabilityContentProps {
  isChannelSelected: (channel: Channel) => boolean;
  channels: Channel[];
  onChange: (option: Channel) => void;
}

const ChannelsAvailabilityContent: React.FC<ChannelsAvailabilityContentProps> = ({
  isChannelSelected,
  channels,
  onChange,
}) => {
  return (
    <>
      {channels.map((option, index) => (
        <Box key={option.id} data-test-id="channel-row">
          <Checkbox
            checked={isChannelSelected(option)}
            name={option.name}
            onCheckedChange={() => onChange(option)}
            paddingY={3}
          >
            <Text size={4}>{option.name}</Text>
          </Checkbox>
          {index < channels.length - 1 && (
            <Divider __marginLeft="-24px" __width="calc(100% + 48px)" />
          )}
        </Box>
      ))}
    </>
  );
};

export default ChannelsAvailabilityContent;
