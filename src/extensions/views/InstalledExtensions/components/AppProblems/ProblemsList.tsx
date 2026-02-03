import Link from "@dashboard/components/Link";
import { problemMessages } from "@dashboard/extensions/messages";
import {
  AppProblem,
  getProblemSortDate,
  isProblemCritical,
  isProblemDismissed,
} from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";
import { ProblemCard } from "./ProblemCard";
import { ProblemTypeBadge } from "./ProblemTypeBadge";

const MAX_VISIBLE_PROBLEMS = 3;

interface ProblemsListProps {
  problems: AppProblem[];
  appId: string;
  onClearProblem?: (appId: string, keys?: string[]) => void;
  hasManagedAppsPermission?: boolean;
}

const sortProblems = (problems: AppProblem[]): AppProblem[] =>
  [...problems].sort((a, b) => {
    const aDismissed = isProblemDismissed(a);
    const bDismissed = isProblemDismissed(b);

    // Dismissed always after non-dismissed
    if (aDismissed !== bDismissed) {
      return aDismissed ? 1 : -1;
    }

    const aCritical = isProblemCritical(a);
    const bCritical = isProblemCritical(b);

    // Critical before non-critical
    if (aCritical !== bCritical) {
      return aCritical ? -1 : 1;
    }

    // Newest first (by updatedAt / createdAt)
    return new Date(getProblemSortDate(b)).getTime() - new Date(getProblemSortDate(a)).getTime();
  });

const getActionLink = (
  problem: AppProblem,
  appId: string,
): { href: string; label: keyof typeof problemMessages } | null => {
  if (problem.__typename === "WebhookDeliveryError") {
    return {
      href: ExtensionsUrls.resolveEditManifestExtensionUrl(appId),
      label: "checkWebhooks",
    };
  }

  if (problem.__typename === "AppProblem") {
    return {
      href: ExtensionsUrls.resolveViewManifestExtensionUrl(appId),
      label: "openTheApp",
    };
  }

  return null;
};

export const ProblemsList = ({
  problems,
  appId,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemsListProps) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => sortProblems(problems), [problems]);

  if (sorted.length === 0) {
    return null;
  }

  const hiddenCount = sorted.length - MAX_VISIBLE_PROBLEMS;
  const hasMore = hiddenCount > 0;
  const visible = expanded ? sorted : sorted.slice(0, MAX_VISIBLE_PROBLEMS);

  return (
    <div className={styles.problemsContainer}>
      {visible.map((problem, index) => {
        const critical = isProblemCritical(problem);
        const dismissed = isProblemDismissed(problem);
        const actionLink = getActionLink(problem, appId);
        const canForceClear =
          hasManagedAppsPermission && problem.__typename === "AppProblem" && !!onClearProblem;

        const borderClass = dismissed
          ? styles.severityDismissed
          : critical
            ? styles.severityError
            : styles.severityWarning;

        return (
          <div
            key={
              problem.__typename === "AppProblem"
                ? `${problem.key}-${problem.createdAt}`
                : problem.createdAt
            }
            className={borderClass}
          >
            {index > 0 && <hr className={styles.groupDivider} />}
            <div className={styles.problemHeader}>
              <ProblemTypeBadge typename={problem.__typename} />
              {critical && !dismissed && <span className={styles.criticalBadge}>Critical</span>}
              {actionLink && (
                <Link href={actionLink.href} className={styles.groupActionLink} inline={false}>
                  {intl.formatMessage(problemMessages[actionLink.label])}
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>
            <ProblemCard
              problem={problem}
              dismissed={dismissed}
              onForceClear={
                canForceClear && problem.__typename === "AppProblem"
                  ? () => onClearProblem(appId, [problem.key])
                  : undefined
              }
            />
          </div>
        );
      })}
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
