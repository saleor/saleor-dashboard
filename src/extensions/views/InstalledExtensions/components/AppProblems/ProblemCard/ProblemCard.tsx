import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import { Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { DismissedLabel } from "./DismissedLabel";
import styles from "./ProblemCard.module.css";
import { ProblemTimestamps } from "./ProblemTimestamps";

interface ProblemCardProps {
  problem: AppProblem;
  dismissed?: boolean;
  onForceClear?: () => void;
}

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
