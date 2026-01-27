import { AppProblem } from "@dashboard/extensions/types";
import useLocale from "@dashboard/hooks/useLocale";
import { TriangleAlert } from "lucide-react";

import styles from "./AppProblems.module.css";
import { ProblemTypeBadge } from "./ProblemTypeBadge";

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
  <div className={styles.problemCard}>
    <div className={styles.problemCardHeader}>
      <TriangleAlert size={16} className={styles.warningIcon} />
      <ProblemTypeBadge typename={problem.__typename} />
      <ProblemTimestamp date={problem.createdAt} />
    </div>
    <span className={styles.problemMessage}>{problem.message}</span>
  </div>
);
