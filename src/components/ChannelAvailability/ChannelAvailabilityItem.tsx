import { Accordion, Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { CurrencyBadge, DraftBadge, ErrorBadge, StatusDot } from "./primitives";
import { type ChannelAvailabilityStatus, type ChannelAvailabilitySummary } from "./types";

interface ChannelAvailabilityItemProps<T extends ChannelAvailabilitySummary> {
  channel: T;
  isLast: boolean;
  isExpanded: boolean;
  status: ChannelAvailabilityStatus;
  children: React.ReactNode;
}

export function ChannelAvailabilityItem<T extends ChannelAvailabilitySummary>({
  channel,
  isLast,
  isExpanded,
  status,
  children,
}: ChannelAvailabilityItemProps<T>) {
  return (
    <Accordion.Item
      value={channel.id}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <Accordion.Trigger>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          paddingX={4}
          paddingY={3}
          width="100%"
          cursor="pointer"
          backgroundColor={{
            default: "transparent",
            hover: "default2",
          }}
          __transition="background-color 0.2s ease"
        >
          <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
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
            <Box display="flex" alignItems="center" transition="ease" className="accordion-chevron">
              <ChevronDown
                size={16}
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Accordion.Trigger>

      <Accordion.Content>
        <Box paddingX={4} paddingBottom={4}>
          <Box paddingBottom={2}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              backgroundColor="default2"
              borderRadius={3}
              __padding="4px 11px"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <StatusDot statusType={status.type} size="small" />
                <Text size={2} fontWeight="medium">
                  {status.label}
                </Text>
              </Box>
              <Text size={2} color="default2">
                {status.description}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          marginX={4}
          marginLeft={6}
          marginBottom={6}
        >
          {children}
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
}

ChannelAvailabilityItem.displayName = "ChannelAvailabilityItem";
