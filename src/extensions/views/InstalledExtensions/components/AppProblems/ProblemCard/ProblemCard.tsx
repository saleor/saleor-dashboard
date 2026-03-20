import Link from "@dashboard/components/Link";
import { problemMessages } from "@dashboard/extensions/messages";
import {
  type AppProblem,
  isProblemCritical,
  isProblemDismissed,
} from "@dashboard/extensions/types";
import { type AppTypeEnum } from "@dashboard/graphql";
import { Button } from "@saleor/macaw-ui-next";
import { ExternalLink } from "lucide-react";
import { useIntl } from "react-intl";

import { ProblemTypeBadge } from "../ProblemTypeBadge/ProblemTypeBadge";
import { getActionLink } from "../utils";
import { DismissedLabel } from "./DismissedLabel";
import styles from "./ProblemCard.module.css";
import { ProblemTimestamps } from "./ProblemTimestamps";

const getSeverityClass = ({ dismissed, critical }: { dismissed: boolean; critical: boolean }) => {
  if (dismissed) return styles.severityDismissed;

  if (critical) return styles.severityError;

  return styles.severityWarning;
};

interface ProblemCardProps {
  problem: AppProblem;
  appId: string;
  appType?: AppTypeEnum | null;
  index: number;
  onClearProblem?: (problemId: string) => void;
  hasManagedAppsPermission?: boolean;
}

export const ProblemCard = ({
  problem,
  appId,
  appType,
  index,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemCardProps) => {
  const intl = useIntl();
  const critical = isProblemCritical(problem);
  const dismissed = isProblemDismissed(problem);
  const actionLink = getActionLink(problem, appId, appType);
  const canForceClear =
    hasManagedAppsPermission && problem.__typename === "AppProblem" && !!onClearProblem;

  const borderClass = getSeverityClass({ dismissed, critical });

  return (
    <div className={borderClass}>
      {index > 0 && <hr className={styles.groupDivider} />}
      <div className={styles.problemHeader}>
        <ProblemTypeBadge typename={problem.__typename} />
        {critical && !dismissed && (
          <span className={styles.criticalBadge}>
            {intl.formatMessage(problemMessages.critical)}
          </span>
        )}
        {problem.__typename === "AppProblem" && problem.count > 1 && (
          <span className={styles.countBadge}>{problem.count}×</span>
        )}
        {actionLink && !dismissed && (
          <Link href={actionLink.href} className={styles.groupActionLink} inline={false}>
            {intl.formatMessage(problemMessages[actionLink.label])}
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
      <div className={`${styles.problemRow} ${dismissed ? styles.problemRowDismissed : ""}`}>
        <div className={styles.problemRowHeader}>
          <ProblemTimestamps problem={problem} />
          {dismissed && <DismissedLabel problem={problem} />}
          {!dismissed && canForceClear && problem.__typename === "AppProblem" && (
            <Button
              variant="secondary"
              size="small"
              onClick={e => {
                e.preventDefault();
                onClearProblem(problem.id);
              }}
            >
              {intl.formatMessage(problemMessages.forceClear)}
            </Button>
          )}
        </div>
        <div className={styles.problemMessage}>{problem.message}</div>
      </div>
    </div>
  );
};
