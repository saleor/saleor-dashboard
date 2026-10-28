import { DateTime } from "@dashboard/components/Date/DateTime";
import { circuitBreakerMessages } from "@dashboard/extensions/messages";
import { CircuitBreakerStateEnum } from "@dashboard/graphql";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Activity, Unplug } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./CircuitBreakerBadge.module.css";

interface CircuitBreakerBadgeProps {
  state: CircuitBreakerStateEnum;
  lastStateChange?: string | null;
}

const variants = {
  [CircuitBreakerStateEnum.HALF_OPEN]: {
    className: styles.halfOpen,
    Icon: Activity,
    label: circuitBreakerMessages.halfOpenLabel,
    description: circuitBreakerMessages.halfOpenDescription,
  },
  [CircuitBreakerStateEnum.OPEN]: {
    className: styles.open,
    Icon: Unplug,
    label: circuitBreakerMessages.openLabel,
    description: circuitBreakerMessages.openDescription,
  },
};

/** Sync webhooks of the app are paused or on probation. CLOSED is healthy and renders nothing. */
export const CircuitBreakerBadge = ({
  state,
  lastStateChange,
}: CircuitBreakerBadgeProps): ReactNode => {
  if (state === CircuitBreakerStateEnum.CLOSED) {
    return null;
  }

  const { className, Icon, label, description } = variants[state];

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className={className} tabIndex={0} data-test-id="circuit-breaker-badge">
          <Icon size={14} />
          <FormattedMessage {...label} />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <Box __maxWidth="320px" display="flex" flexDirection="column" gap={1}>
          <Text size={2}>
            <FormattedMessage {...description} />
          </Text>
          {lastStateChange && (
            <Text size={2} color="default2">
              <FormattedMessage
                {...circuitBreakerMessages.since}
                values={{ date: <DateTime date={lastStateChange} plain /> }}
              />
            </Text>
          )}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
