import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import useLocale from "@dashboard/hooks/useLocale";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";

interface ProblemCardProps {
  problem: AppProblem;
  dismissed?: boolean;
  onForceClear?: () => void;
}

const useFormattedDates = (date: string) => {
  const { locale } = useLocale();

  return useMemo(() => {
    const d = new Date(date);

    const short = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);

    const local = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);

    const utc = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(d);

    return { short, local, utc };
  }, [date, locale]);
};

const TimestampWithTooltip = ({ date, label }: { date: string; label?: string }) => {
  const { short, local, utc } = useFormattedDates(date);

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <time dateTime={date} className={styles.timestampHoverable}>
          {label ? `${label} ${short}` : short}
        </time>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        <div className={styles.timestampTooltip}>
          <div>Local: {local}</div>
          <div>UTC: {utc}</div>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

const ProblemTimestamps = ({ problem }: { problem: AppProblem }) => {
  const count = problem.__typename === "AppProblem" ? problem.count : 1;
  const updatedAt = problem.__typename === "AppProblem" ? problem.updatedAt : null;
  const showUpdated = count > 1 && updatedAt && updatedAt !== problem.createdAt;

  return (
    <span className={styles.timestamp}>
      {showUpdated ? (
        <>
          <TimestampWithTooltip date={problem.createdAt} label="Started at" />
          {", "}
          <TimestampWithTooltip date={updatedAt} label="last occurred at" />
        </>
      ) : (
        <TimestampWithTooltip date={problem.createdAt} />
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
