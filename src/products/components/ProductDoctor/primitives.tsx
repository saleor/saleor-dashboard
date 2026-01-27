import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { Box, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, CircleAlert } from "lucide-react";
import * as React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

/** Violet color for scheduled states - distinct from link color (accent1) */
export const SCHEDULED_COLOR = "oklch(60.6% 0.25 292.717)";

/** Background color for scheduled state callouts */
export const SCHEDULED_BACKGROUND_COLOR = "oklch(95% 0.03 292.717)";

export type AvailabilityStatus = "live" | "scheduled" | "hidden";

interface StatusDotProps {
  status: AvailabilityStatus;
  size?: "small" | "default";
  hasIssues?: boolean;
  issueType?: "error" | "warning";
}

export const StatusDot = ({
  status,
  size = "default",
  hasIssues = false,
  issueType = "warning",
}: StatusDotProps) => {
  const dotSize = size === "small" ? 8 : 10;

  const getStatusColor = () => {
    if (hasIssues) {
      return issueType === "error"
        ? "var(--mu-colors-background-critical1)"
        : "var(--mu-colors-background-warning1)";
    }

    switch (status) {
      case "live":
        return SUCCESS_ICON_COLOR;
      case "scheduled":
        return SCHEDULED_COLOR;
      case "hidden":
        return "var(--mu-colors-text-default2)";
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

export const DirtyBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="warning1"
      paddingX={2}
      paddingY={0}
      borderRadius={8}
      borderWidth={1}
      borderStyle="solid"
      borderColor="warning1"
    >
      <Text size={1} color="warning1" fontWeight="medium" __fontSize="10px" __lineHeight="16px">
        {intl.formatMessage(messages.editedBadge)}
      </Text>
    </Box>
  );
};

export const ToRemoveBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="default1"
      paddingX={2}
      paddingY={0}
      borderRadius={8}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
    >
      <Text size={1} color="default2" fontWeight="medium" __fontSize="10px" __lineHeight="16px">
        {intl.formatMessage(messages.toRemoveBadge)}
      </Text>
    </Box>
  );
};

export const NewBadge = () => {
  const intl = useIntl();

  return (
    <Box
      paddingX={2}
      paddingY={0}
      borderRadius={8}
      borderWidth={1}
      borderStyle="solid"
      borderColor="success1"
    >
      <Text size={1} color="success1" fontWeight="medium" __fontSize="10px" __lineHeight="16px">
        {intl.formatMessage(messages.newBadge)}
      </Text>
    </Box>
  );
};

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
        {intl.formatMessage(messages.errorBadge)}
      </Text>
    </Box>
  );
};

interface IssueBadgeProps {
  count: number;
  type: "error" | "warning";
}

export const IssueBadge = ({ count, type }: IssueBadgeProps) => {
  const intl = useIntl();
  const iconColor =
    type === "error" ? "var(--mu-colors-text-critical1)" : "var(--mu-colors-text-warning1)";
  const title = intl.formatMessage(messages.channelHasIssues, { count });

  return (
    <Box display="flex" alignItems="center" title={title} position="relative">
      {type === "error" ? (
        <AlertTriangle size={16} color={iconColor} />
      ) : (
        <CircleAlert size={16} color={iconColor} />
      )}
      {count > 1 && (
        <Text
          size={1}
          color={type === "error" ? "critical1" : "warning1"}
          fontWeight="medium"
          __position="absolute"
          __top="-4px"
          __right="-6px"
          __fontSize="10px"
        >
          {count}
        </Text>
      )}
    </Box>
  );
};

interface InfoCalloutProps {
  children: React.ReactNode;
}

export const InfoCallout = ({ children }: InfoCalloutProps) => (
  <Box
    __backgroundColor="var(--mu-colors-background-default2)"
    borderRadius={3}
    paddingX={3}
    paddingY={2}
  >
    <Text size={2} color="default2">
      {children}
    </Text>
  </Box>
);

/**
 * Reusable icon wrapper that provides consistent sizing and color based on state.
 */
interface IconWrapperProps {
  isActive: boolean;
  activeColor?: string;
  children: React.ReactNode;
}

export const IconWrapper = ({
  isActive,
  activeColor = SUCCESS_ICON_COLOR,
  children,
}: IconWrapperProps) => (
  <Box display="flex" alignItems="center" color={isActive ? undefined : "default2"}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<{ color?: string; strokeWidth?: number }>,
          {
            color: isActive ? activeColor : "var(--mu-colors-text-default2)",
            strokeWidth: isActive ? 2 : 1.5,
          },
        );
      }

      return child;
    })}
  </Box>
);
