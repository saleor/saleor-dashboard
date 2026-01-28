import { problemMessages } from "@dashboard/extensions/messages";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsBadgeProps {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}

export const ProblemsBadge = ({ count, expanded, onToggle }: ProblemsBadgeProps) => {
  const intl = useIntl();

  if (count === 0) {
    return null;
  }

  return (
    <button
      className={styles.problemsBadge}
      onClick={e => {
        e.preventDefault();
        onToggle();
      }}
    >
      {intl.formatMessage(problemMessages.problemCount, { count })}
      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
};
