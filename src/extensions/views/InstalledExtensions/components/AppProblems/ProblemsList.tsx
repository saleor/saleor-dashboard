import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";
import { ProblemCard } from "./ProblemCard";

const MAX_VISIBLE_PROBLEMS = 3;

interface ProblemsListProps {
  problems: AppProblem[];
}

export const ProblemsList = ({ problems }: ProblemsListProps) => {
  const intl = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (problems.length === 0) {
    return null;
  }

  if (collapsed) {
    return (
      <div className={styles.problemsList}>
        <button
          className={styles.showMoreButton}
          onClick={e => {
            e.preventDefault();
            setCollapsed(false);
          }}
        >
          <ChevronDown size={16} />
          {intl.formatMessage(problemMessages.showMoreProblems, {
            count: problems.length,
          })}
        </button>
      </div>
    );
  }

  const visibleProblems = expanded ? problems : problems.slice(0, MAX_VISIBLE_PROBLEMS);
  const hiddenCount = problems.length - MAX_VISIBLE_PROBLEMS;
  const hasMore = hiddenCount > 0;

  return (
    <div className={styles.problemsList}>
      <button
        className={styles.showMoreButton}
        onClick={e => {
          e.preventDefault();
          setCollapsed(true);
          setExpanded(false);
        }}
      >
        <ChevronUp size={16} />
        {intl.formatMessage(problemMessages.hideProblems)}
      </button>
      {visibleProblems.map((problem, index) => (
        <ProblemCard key={index} problem={problem} />
      ))}
      {hasMore && (
        <button
          className={styles.showMoreButton}
          onClick={e => {
            e.preventDefault();
            setExpanded(prev => !prev);
          }}
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              {intl.formatMessage(problemMessages.showLessProblems)}
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              {intl.formatMessage(problemMessages.showMoreProblems, {
                count: hiddenCount,
              })}
            </>
          )}
        </button>
      )}
    </div>
  );
};
