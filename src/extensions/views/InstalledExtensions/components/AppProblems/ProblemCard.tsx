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
    <>
      {label && `${label} `}
      <Tooltip>
        <Tooltip.Trigger>
          <time dateTime={date} className={styles.timestampHoverable}>
            {short}
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
    </>
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

const getDismissedByText = (problem: AppProblem): string | null => {
  if (problem.__typename !== "AppProblem" || !problem.dismissed) {
    return null;
  }

  if (problem.dismissed.by === "USER" && problem.dismissed.userEmail) {
    return `Dismissed by ${problem.dismissed.userEmail}`;
  }

  if (problem.dismissed.by === "APP") {
    return "Dismissed by app";
  }

  return "Dismissed";
};

const DismissedLabel = ({ problem }: { problem: AppProblem }) => {
  const tooltipText = getDismissedByText(problem);

  if (tooltipText) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <span className={styles.dismissedLabel}>Dismissed</span>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          {tooltipText}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return <span className={styles.dismissedLabel}>Dismissed</span>;
};

export const ProblemCard = ({ problem, dismissed, onForceClear }: ProblemCardProps) => {
  const intl = useIntl();

  return (
    <div className={`${styles.problemRow} ${dismissed ? styles.problemRowDismissed : ""}`}>
      <div className={styles.problemRowHeader}>
        <ProblemTimestamps problem={problem} />
        {dismissed && <DismissedLabel problem={problem} />}
        {!dismissed && onForceClear && (
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
        )}
      </div>
      <div className={styles.problemMessage}>{problem.message}</div>
    </div>
  );
};
