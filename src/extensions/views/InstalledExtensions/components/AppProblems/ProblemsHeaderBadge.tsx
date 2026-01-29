import { problemMessages } from "@dashboard/extensions/messages";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemsHeaderBadgeProps {
  errorCount: number;
  warningCount: number;
}

export const ProblemsHeaderBadge = ({ errorCount, warningCount }: ProblemsHeaderBadgeProps) => {
  const intl = useIntl();

  return (
    <>
      {errorCount > 0 && (
        <span className={styles.headerBadgeError}>
          <CircleAlert size={14} />
          {intl.formatMessage(problemMessages.errorCount, { count: errorCount })}
        </span>
      )}
      {warningCount > 0 && (
        <span className={styles.headerBadgeWarning}>
          <TriangleAlert size={14} />
          {intl.formatMessage(problemMessages.warningCount, { count: warningCount })}
        </span>
      )}
    </>
  );
};
