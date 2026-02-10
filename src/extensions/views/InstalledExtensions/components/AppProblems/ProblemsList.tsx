import Link from "@dashboard/components/Link";
import { DashboardModal } from "@dashboard/components/Modal";
import { problemMessages } from "@dashboard/extensions/messages";
import {
  AppProblem,
  getProblemSortDate,
  isProblemCritical,
  isProblemDismissed,
} from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { ExternalLink, Maximize2 } from "lucide-react";
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
  showInline?: boolean;
  modalOpen?: boolean;
  onModalOpenChange?: (open: boolean) => void;
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

interface ProblemItemProps {
  problem: AppProblem;
  appId: string;
  index: number;
  onClearProblem?: (appId: string, keys?: string[]) => void;
  hasManagedAppsPermission?: boolean;
}

const ProblemItem = ({
  problem,
  appId,
  index,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemItemProps) => {
  const intl = useIntl();
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
};

export const ProblemsList = ({
  problems,
  appId,
  onClearProblem,
  hasManagedAppsPermission,
  showInline = true,
  modalOpen,
  onModalOpenChange,
}: ProblemsListProps) => {
  const intl = useIntl();
  const [internalPopupOpen, setInternalPopupOpen] = useState(false);

  const isPopupOpen = modalOpen ?? internalPopupOpen;
  const handlePopupChange = (open: boolean) => {
    if (onModalOpenChange) {
      onModalOpenChange(open);
    } else {
      setInternalPopupOpen(open);
    }
  };

  const sorted = useMemo(() => sortProblems(problems), [problems]);

  if (sorted.length === 0) {
    return null;
  }

  const hiddenCount = sorted.length - MAX_VISIBLE_PROBLEMS;
  const hasMore = hiddenCount > 0;
  const visible = sorted.slice(0, MAX_VISIBLE_PROBLEMS);

  const hiddenProblems = sorted.slice(MAX_VISIBLE_PROBLEMS);
  const activeInHidden = hiddenProblems.filter(p => !isProblemDismissed(p)).length;
  const criticalInHidden = hiddenProblems.filter(
    p => isProblemCritical(p) && !isProblemDismissed(p),
  ).length;

  return (
    <>
      {showInline && (
        <div className={styles.problemsContainer}>
          {visible.map((problem, index) => (
            <ProblemItem
              key={
                problem.__typename === "AppProblem"
                  ? `${problem.key}-${problem.createdAt}`
                  : problem.createdAt
              }
              problem={problem}
              appId={appId}
              index={index}
              onClearProblem={onClearProblem}
              hasManagedAppsPermission={hasManagedAppsPermission}
            />
          ))}
          {hasMore && (
            <button
              className={styles.showMoreButton}
              onClick={e => {
                e.preventDefault();
                handlePopupChange(true);
              }}
            >
              <Maximize2 size={16} />
              {intl.formatMessage(problemMessages.showMoreProblems, {
                count: hiddenCount,
              })}
              {activeInHidden > 0 && criticalInHidden > 0
                ? intl.formatMessage(problemMessages.showMoreIncludingActiveAndCritical, {
                    active: activeInHidden,
                    critical: criticalInHidden,
                  })
                : activeInHidden > 0
                  ? intl.formatMessage(problemMessages.showMoreIncludingActive, {
                      active: activeInHidden,
                    })
                  : criticalInHidden > 0
                    ? intl.formatMessage(problemMessages.showMoreIncludingCritical, {
                        critical: criticalInHidden,
                      })
                    : null}
            </button>
          )}
        </div>
      )}
      <DashboardModal open={isPopupOpen} onChange={() => handlePopupChange(false)}>
        <DashboardModal.Content size="md">
          <DashboardModal.Header>
            {intl.formatMessage(problemMessages.allProblems, {
              count: sorted.length,
            })}
          </DashboardModal.Header>
          <div className={styles.popupProblemsList}>
            {sorted.map((problem, index) => (
              <ProblemItem
                key={
                  problem.__typename === "AppProblem"
                    ? `${problem.key}-${problem.createdAt}`
                    : problem.createdAt
                }
                problem={problem}
                appId={appId}
                index={index}
                onClearProblem={onClearProblem}
                hasManagedAppsPermission={hasManagedAppsPermission}
              />
            ))}
          </div>
        </DashboardModal.Content>
      </DashboardModal>
    </>
  );
};
