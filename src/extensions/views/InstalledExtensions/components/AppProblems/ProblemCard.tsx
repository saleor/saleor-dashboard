import { AppProblem } from "@dashboard/extensions/types";
import useLocale from "@dashboard/hooks/useLocale";

import styles from "./AppProblems.module.css";

interface ProblemCardProps {
  problem: AppProblem;
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

export const ProblemCard = ({ problem }: ProblemCardProps) => (
  <div className={styles.problemRow}>
    <ProblemTimestamp date={problem.createdAt} />
    <div className={styles.problemMessage}>{problem.message}</div>
  </div>
);
