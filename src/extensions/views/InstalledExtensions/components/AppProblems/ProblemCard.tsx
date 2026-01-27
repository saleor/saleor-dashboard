import EventTime from "@dashboard/components/EventTime/EventTime";
import { AppProblem } from "@dashboard/extensions/types";
import { TriangleAlert } from "lucide-react";

import styles from "./AppProblems.module.css";
import { ProblemTypeBadge } from "./ProblemTypeBadge";

interface ProblemCardProps {
  problem: AppProblem;
}

export const ProblemCard = ({ problem }: ProblemCardProps) => (
  <div className={styles.problemCard}>
    <div className={styles.problemCardHeader}>
      <TriangleAlert size={16} className={styles.warningIcon} />
      <ProblemTypeBadge typename={problem.__typename} />
      <span className={styles.timestamp}>
        <EventTime date={problem.createdAt} />
      </span>
    </div>
    <span className={styles.problemMessage}>{problem.message}</span>
  </div>
);
