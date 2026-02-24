import { problemMessages } from "@dashboard/extensions/messages";
import { type AppProblem } from "@dashboard/extensions/types";
import { useIntl } from "react-intl";

import styles from "./ProblemCard.module.css";
import { TimestampWithTooltip } from "./TimestampWithTooltip";

export const ProblemTimestamps = ({ problem }: { problem: AppProblem }) => {
  const intl = useIntl();
  const count = problem.__typename === "AppProblem" ? problem.count : 1;
  const updatedAt = problem.__typename === "AppProblem" ? problem.updatedAt : null;
  const showUpdated = count > 1 && updatedAt && updatedAt !== problem.createdAt;

  return (
    <span className={styles.timestamp}>
      {showUpdated ? (
        <>
          <TimestampWithTooltip
            date={problem.createdAt}
            label={intl.formatMessage(problemMessages.startedAt)}
          />
          {", "}
          <TimestampWithTooltip
            date={updatedAt}
            label={intl.formatMessage(problemMessages.lastOccurredAt)}
          />
        </>
      ) : (
        <TimestampWithTooltip date={problem.createdAt} />
      )}
    </span>
  );
};
