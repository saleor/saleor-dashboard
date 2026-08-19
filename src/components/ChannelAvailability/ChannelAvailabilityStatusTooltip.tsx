import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import type * as React from "react";

interface ChannelAvailabilityStatusTooltipProps {
  label: React.ReactNode;
  description: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Status tooltip inside an accordion trigger — preventDefault on pointerdown
 * stops Radix Tooltip from stealing the first click/focus from the collapsible trigger.
 */
export const ChannelAvailabilityStatusTooltip = ({
  label,
  description,
  extra,
  children,
}: ChannelAvailabilityStatusTooltipProps) => (
  <Tooltip>
    <Tooltip.Trigger>
      <Box display="inline-flex" onPointerDown={event => event.preventDefault()}>
        {children}
      </Box>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <Tooltip.Arrow />
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={2} fontWeight="medium">
          {label}
        </Text>
        <Text size={1} color="default2">
          {description}
        </Text>
        {extra}
      </Box>
    </Tooltip.Content>
  </Tooltip>
);

ChannelAvailabilityStatusTooltip.displayName = "ChannelAvailabilityStatusTooltip";
