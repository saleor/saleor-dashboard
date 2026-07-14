import { ChannelDisplay } from "@dashboard/components/Channel/Channel";
import { Box, Select, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { type ChannelFromOrder } from "./utils";

interface CustomerOverviewChannelScopeProps {
  channels: ChannelFromOrder[];
  selectedChannelId: string | undefined;
  onChannelChange: (channelId: string) => void;
}

export const CustomerOverviewChannelScope = ({
  channels,
  selectedChannelId,
  onChannelChange,
}: CustomerOverviewChannelScopeProps): JSX.Element | null => {
  if (channels.length === 0) {
    return null;
  }

  const selectedChannel = channels.find(channel => channel.id === selectedChannelId) ?? channels[0];

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
      paddingBottom={4}
      data-test-id="customer-overview-channel-scope"
    >
      <Text size={2} color="default2">
        <FormattedMessage
          defaultMessage="Statistics from"
          description="customer overview, prefix before channel name or channel selector"
          id="htV3fN"
        />
      </Text>
      {channels.length > 1 ? (
        <Select
          data-test-id="customer-overview-channel-select"
          size="small"
          __width={168}
          options={channels.map(channel => ({
            label: channel.name,
            value: channel.id,
          }))}
          value={selectedChannelId ?? selectedChannel.id}
          onChange={onChannelChange}
        />
      ) : (
        <ChannelDisplay
          channel={selectedChannel}
          size={2}
          data-test-id="customer-overview-channel"
        />
      )}
    </Box>
  );
};

CustomerOverviewChannelScope.displayName = "CustomerOverviewChannelScope";
