import { problemMessages } from "@dashboard/extensions/messages";
import { TriangleAlert } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsHeaderBadgeProps {
  count: number;
}

export const ProblemsHeaderBadge = ({ count }: ProblemsHeaderBadgeProps) => {
  const intl = useIntl();

  if (count === 0) {
    return null;
  }

  return (
    <span className={styles.headerBadge}>
      <TriangleAlert size={14} />
      {intl.formatMessage(problemMessages.problemCount, { count })}
    </span>
  );
};
