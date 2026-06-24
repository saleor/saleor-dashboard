import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";

import { ChannelIcon, CurrencyBadge, DraftBadge, ErrorBadge, StatusDot } from "./primitives";
import {
  type ChannelAvailabilityListLeadingVisual,
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "./types";

interface ChannelAvailabilityListItemProps<T extends ChannelAvailabilitySummary> {
  channel: T;
  isLast: boolean;
  status: ChannelAvailabilityStatus;
  leadingVisual?: ChannelAvailabilityListLeadingVisual;
}

export function ChannelAvailabilityListItem<T extends ChannelAvailabilitySummary>({
  channel,
  isLast,
  status,
  leadingVisual = "status-dot",
}: ChannelAvailabilityListItemProps<T>) {
  const leading =
    leadingVisual === "channel-icon" ? (
      <ChannelIcon />
    ) : (
      <Tooltip>
        <Tooltip.Trigger>
          <Box>
            <StatusDot statusType={status.type} />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          <Tooltip.Arrow />
          <Box display="flex" flexDirection="column" gap={1}>
            <Text size={2} fontWeight="medium">
              {status.label}
            </Text>
            <Text size={1} color="default2">
              {status.description}
            </Text>
          </Box>
        </Tooltip.Content>
      </Tooltip>
    );

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      paddingX={4}
      paddingY={3}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
      data-test-id="channel-availability-list-item"
    >
      <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
        {leading}
        <Text
          size={3}
          fontWeight="medium"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          title={channel.name}
        >
          {channel.name}
        </Text>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        {status.badge === "error" && <ErrorBadge />}
        {status.badge === "draft" && <DraftBadge />}
        <CurrencyBadge currency={channel.currencyCode} />
      </Box>
    </Box>
  );
}

ChannelAvailabilityListItem.displayName = "ChannelAvailabilityListItem";
