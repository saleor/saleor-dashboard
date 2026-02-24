import { problemMessages } from "@dashboard/extensions/messages";
import { type AppProblem } from "@dashboard/extensions/types";
import { Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import styles from "./ProblemCard.module.css";

const useDismissedByText = (problem: AppProblem): string | null => {
  const intl = useIntl();

  if (problem.__typename !== "AppProblem" || !problem.dismissed) {
    return null;
  }

  if (problem.dismissed.by === "USER" && problem.dismissed.userEmail) {
    return intl.formatMessage(problemMessages.dismissedByUser, {
      email: problem.dismissed.userEmail,
    });
  }

  if (problem.dismissed.by === "APP") {
    return intl.formatMessage(problemMessages.dismissedByApp);
  }

  return intl.formatMessage(problemMessages.dismissed);
};

export const DismissedLabel = ({ problem }: { problem: AppProblem }) => {
  const intl = useIntl();
  const tooltipText = useDismissedByText(problem);

  if (tooltipText) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <span className={styles.dismissedLabel}>
            {intl.formatMessage(problemMessages.dismissed)}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          {tooltipText}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <span className={styles.dismissedLabel}>{intl.formatMessage(problemMessages.dismissed)}</span>
  );
};
