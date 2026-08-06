import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

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
  const leadingVisualNode: ReactNode =
    leadingVisual === "channel-icon" ? (
      <ChannelIcon statusType={status.type} />
    ) : (
      <StatusDot statusType={status.type} />
    );

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      paddingX={4}
      paddingY={2}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
      data-test-id="channel-availability-list-item"
    >
      <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
        <Tooltip>
          <Tooltip.Trigger>
            <Box>{leadingVisualNode}</Box>
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
