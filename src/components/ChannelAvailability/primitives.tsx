import { SCHEDULED_COLOR, SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Globe } from "lucide-react";
import { useIntl } from "react-intl";

import { channelAvailabilityMessages } from "./messages";
import { type ChannelAvailabilityStatusType } from "./types";

const channelIconColor = (statusType?: ChannelAvailabilityStatusType): string => {
  if (statusType === "success") {
    return SUCCESS_ICON_COLOR;
  }

  return "var(--mu-colors-text-default2)";
};

interface StatusDotProps {
  statusType: ChannelAvailabilityStatusType;
  size?: "small" | "default";
}

export const StatusDot = ({ statusType, size = "default" }: StatusDotProps) => {
  const dotSize = size === "small" ? 8 : 10;

  const getStatusColor = () => {
    switch (statusType) {
      case "success":
        return SUCCESS_ICON_COLOR;
      case "scheduled":
        return SCHEDULED_COLOR;
      case "hidden":
        return "var(--mu-colors-text-default2)";
      case "warning":
        return "var(--mu-colors-background-warning1)";
      case "error":
        return "var(--mu-colors-background-critical1)";
    }
  };

  return (
    <Box
      borderRadius="100%"
      __width={`${dotSize}px`}
      __height={`${dotSize}px`}
      __backgroundColor={getStatusColor()}
      flexShrink="0"
    />
  );
};

interface ChannelIconProps {
  /** When `success`, globe is green — otherwise muted gray. */
  statusType?: ChannelAvailabilityStatusType;
}

export const ChannelIcon = ({ statusType }: ChannelIconProps) => (
  <Box display="flex" alignItems="center" flexShrink="0" data-test-id="channel-availability-icon">
    <Globe size={14} aria-hidden="true" color={channelIconColor(statusType)} />
  </Box>
);

interface CurrencyBadgeProps {
  currency: string;
}

export const CurrencyBadge = ({ currency }: CurrencyBadgeProps) => (
  <Box backgroundColor="default1" paddingX={2} paddingY={1} borderRadius={2}>
    <Text size={1} color="default2" fontWeight="medium">
      {currency}
    </Text>
  </Box>
);

export const ErrorBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="critical1"
      paddingX={2}
      paddingY={0.5}
      borderRadius={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="critical1"
    >
      <Text size={1} color="critical1" fontWeight="medium">
        {intl.formatMessage(channelAvailabilityMessages.errorBadge)}
      </Text>
    </Box>
  );
};

export const DraftBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="default1"
      paddingX={2}
      paddingY={0.5}
      borderRadius={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
    >
      <Text size={1} color="default2" fontWeight="medium">
        {intl.formatMessage(channelAvailabilityMessages.draftBadge)}
      </Text>
    </Box>
  );
};
