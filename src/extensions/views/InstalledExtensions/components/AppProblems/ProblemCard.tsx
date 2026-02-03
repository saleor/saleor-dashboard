import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import useLocale from "@dashboard/hooks/useLocale";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemCardProps {
  problem: AppProblem;
  dismissed?: boolean;
  onForceClear?: () => void;
}

const useFormattedDate = (date: string) => {
  const { locale } = useLocale();

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const ProblemTimestamps = ({ problem }: { problem: AppProblem }) => {
  const createdFormatted = useFormattedDate(problem.createdAt);
  const updatedAt = problem.__typename === "AppProblem" ? problem.updatedAt : null;
  const updatedFormatted = useFormattedDate(updatedAt ?? problem.createdAt);
  const showUpdated = updatedAt && updatedAt !== problem.createdAt;

  return (
    <span className={styles.timestamp}>
      <time dateTime={problem.createdAt}>Started at {createdFormatted}</time>
      {showUpdated && (
        <>
          {", "}
          <time dateTime={updatedAt}>last occurred at {updatedFormatted}</time>
        </>
      )}
    </span>
  );
};

export const ProblemCard = ({ problem, dismissed, onForceClear }: ProblemCardProps) => {
  const intl = useIntl();

  return (
    <div className={`${styles.problemRow} ${dismissed ? styles.problemRowDismissed : ""}`}>
      <div className={styles.problemRowHeader}>
        <ProblemTimestamps problem={problem} />
        {dismissed && <span className={styles.dismissedLabel}>Dismissed</span>}
        {!dismissed && onForceClear && (
          <Tooltip>
            <Tooltip.Trigger>
              <Button
                variant="secondary"
                size="small"
                onClick={e => {
                  e.preventDefault();
                  onForceClear();
                }}
              >
                {intl.formatMessage(problemMessages.forceClear)}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              {intl.formatMessage(problemMessages.forceClearTooltip)}
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>
      <div className={styles.problemMessage}>{problem.message}</div>
    </div>
  );
};
