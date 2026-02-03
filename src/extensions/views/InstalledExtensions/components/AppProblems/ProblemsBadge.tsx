import { problemMessages } from "@dashboard/extensions/messages";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsBadgeProps {
  totalCount: number;
  criticalCount: number;
  expanded: boolean;
  onToggle: () => void;
}

export const ProblemsBadge = ({
  totalCount,
  criticalCount,
  expanded,
  onToggle,
}: ProblemsBadgeProps) => {
  const intl = useIntl();

  if (totalCount === 0) {
    return null;
  }

  const label =
    criticalCount > 0
      ? `${intl.formatMessage(problemMessages.problemCount, { count: totalCount })}, ${intl.formatMessage(problemMessages.includingCritical, { count: criticalCount })}`
      : intl.formatMessage(problemMessages.problemCount, { count: totalCount });

  return (
    <button
      className={criticalCount > 0 ? styles.problemsBadgeError : styles.problemsBadgeWarning}
      onClick={e => {
        e.preventDefault();
        onToggle();
      }}
    >
      {label}
      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
};
