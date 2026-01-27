import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import { Tooltip } from "@saleor/macaw-ui-next";
import { Package, Radio, Zap } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemTypeBadgeProps {
  typename: AppProblem["__typename"];
}

export const ProblemTypeBadge = ({ typename }: ProblemTypeBadgeProps) => {
  const intl = useIntl();

  if (typename === "AppProblemCircuitBreaker") {
    return (
      <span className={styles.circuitBreakerBadge}>
        <Zap size={12} />
        {intl.formatMessage(problemMessages.circuitBreakerType)}
      </span>
    );
  }

  if (typename === "WebhookDeliveryError") {
    return (
      <span className={styles.webhookBadge}>
        <Radio size={12} />
        {intl.formatMessage(problemMessages.webhookDeliveryType)}
      </span>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className={styles.customBadge}>
          <Package size={12} />
          {intl.formatMessage(problemMessages.customType)}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        {intl.formatMessage(problemMessages.customTypeTooltip)}
      </Tooltip.Content>
    </Tooltip>
  );
};
