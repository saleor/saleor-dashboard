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

  const label = intl.formatMessage(problemMessages.problemSummary, {
    count: totalCount,
    hasCritical: criticalCount > 0 ? "true" : "false",
    criticalCount,
  });

  return (
    <button
      type="button"
      className={criticalCount > 0 ? styles.problemsBadgeError : styles.problemsBadgeWarning}
      aria-expanded={expanded}
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
