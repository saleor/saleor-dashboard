import { problemMessages } from "@dashboard/extensions/messages";
import { CircleAlert } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsHeaderBadgeProps {
  totalCount: number;
  criticalCount: number;
}

export const ProblemsHeaderBadge = ({ totalCount, criticalCount }: ProblemsHeaderBadgeProps) => {
  const intl = useIntl();

  if (totalCount === 0) {
    return null;
  }

  const label = intl.formatMessage(problemMessages.problemSummary, {
    count: totalCount,
    hasCritical: criticalCount > 0 ? "true" : "false",
    criticalCount,
  });

  return (
    <span className={criticalCount > 0 ? styles.headerBadgeError : styles.headerBadgeWarning}>
      <CircleAlert size={14} />
      {label}
    </span>
  );
};
