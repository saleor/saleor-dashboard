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

  const label =
    criticalCount > 0
      ? `${intl.formatMessage(problemMessages.problemCount, { count: totalCount })}, ${intl.formatMessage(problemMessages.includingCritical, { count: criticalCount })}`
      : intl.formatMessage(problemMessages.problemCount, { count: totalCount });

  return (
    <span className={criticalCount > 0 ? styles.headerBadgeError : styles.headerBadgeWarning}>
      <CircleAlert size={14} />
      {label}
    </span>
  );
};
