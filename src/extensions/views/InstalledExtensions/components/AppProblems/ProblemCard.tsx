import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import useLocale from "@dashboard/hooks/useLocale";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemCardProps {
  problem: AppProblem;
  onForceClear?: () => void;
}

const ProblemTimestamp = ({ date }: { date: string }) => {
  const { locale } = useLocale();
  const formatted = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

  return (
    <time dateTime={date} className={styles.timestamp}>
      {formatted}
    </time>
  );
};

export const ProblemCard = ({ problem, onForceClear }: ProblemCardProps) => {
  const intl = useIntl();

  return (
    <div className={styles.problemRow}>
      <div className={styles.problemRowHeader}>
        <ProblemTimestamp date={problem.createdAt} />
        {onForceClear && (
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
