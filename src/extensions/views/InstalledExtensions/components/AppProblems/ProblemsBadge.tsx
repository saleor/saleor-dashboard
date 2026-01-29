import { problemMessages } from "@dashboard/extensions/messages";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsBadgeProps {
  errorCount: number;
  warningCount: number;
  expanded: boolean;
  onToggle: () => void;
}

export const ProblemsBadge = ({
  errorCount,
  warningCount,
  expanded,
  onToggle,
}: ProblemsBadgeProps) => {
  const intl = useIntl();
  const total = errorCount + warningCount;

  if (total === 0) {
    return null;
  }

  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;

  const parts: string[] = [];

  if (hasErrors) {
    parts.push(intl.formatMessage(problemMessages.errorCount, { count: errorCount }));
  }

  if (hasWarnings) {
    parts.push(intl.formatMessage(problemMessages.warningCount, { count: warningCount }));
  }

  return (
    <button
      className={hasErrors ? styles.problemsBadgeError : styles.problemsBadgeWarning}
      onClick={e => {
        e.preventDefault();
        onToggle();
      }}
    >
      {parts.join(", ")}
      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
};
