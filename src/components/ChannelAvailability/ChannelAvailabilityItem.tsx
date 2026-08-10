import { Accordion, Box, Text } from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

import accordionStyles from "./channelAvailabilityAccordion.module.css";
import { ChannelAvailabilityStatusTooltip } from "./ChannelAvailabilityStatusTooltip";
import { CurrencyBadge, DraftBadge, ErrorBadge, StatusDot } from "./primitives";
import { type ChannelAvailabilityStatus, type ChannelAvailabilitySummary } from "./types";

interface ChannelAvailabilityItemProps<T extends ChannelAvailabilitySummary> {
  channel: T;
  isLast: boolean;
  rowIndex: number;
  isOpen: boolean;
  onClose: () => void;
  status: ChannelAvailabilityStatus;
  children: React.ReactNode;
}

export function ChannelAvailabilityItem<T extends ChannelAvailabilitySummary>({
  channel,
  isLast,
  rowIndex,
  isOpen,
  onClose,
  status,
  children,
}: ChannelAvailabilityItemProps<T>) {
  return (
    <Accordion.Item
      value={channel.id}
      className={accordionStyles.row}
      __zIndex={rowIndex + 1}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <Accordion.Trigger
        className={accordionStyles.trigger}
        display="flex"
        alignItems="center"
        gap={2}
        paddingX={4}
        paddingY={2}
        width="100%"
        cursor="pointer"
        onClick={() => {
          if (isOpen) {
            onClose();
          }
        }}
      >
        <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
          <ChannelAvailabilityStatusTooltip label={status.label} description={status.description}>
            <StatusDot statusType={status.type} />
          </ChannelAvailabilityStatusTooltip>
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
          <Box
            display="flex"
            alignItems="center"
            transition="ease"
            className={accordionStyles.chevron}
          >
            <ChevronDown size={16} />
          </Box>
        </Box>
      </Accordion.Trigger>

      <Accordion.Content className={accordionStyles.content}>
        <Box display="flex" flexDirection="column" gap={3} paddingX={4} paddingBottom={6}>
          {children}
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
}

ChannelAvailabilityItem.displayName = "ChannelAvailabilityItem";
