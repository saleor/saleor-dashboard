import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import { Info, Zap } from "lucide-react";
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

  return (
    <span className={styles.customBadge}>
      <Info size={12} />
      {intl.formatMessage(problemMessages.customType)}
    </span>
  );
};
