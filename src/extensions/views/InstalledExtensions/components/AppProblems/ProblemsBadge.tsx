import { problemMessages } from "@dashboard/extensions/messages";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsBadgeProps {
  count: number;
}

export const ProblemsBadge = ({ count }: ProblemsBadgeProps) => {
  const intl = useIntl();

  if (count === 0) {
    return null;
  }

  return (
    <span className={styles.problemsBadge}>
      {intl.formatMessage(problemMessages.problemCount, { count })}
    </span>
  );
};
