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
import { AppTypeEnum } from "@dashboard/graphql";
import { ExternalLink, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";
import { ProblemCard } from "./ProblemCard/ProblemCard";
import { ProblemTypeBadge } from "./ProblemTypeBadge";

const MAX_VISIBLE_PROBLEMS = 3;

interface ProblemsListProps {
  problems: AppProblem[];
  appId: string;
  appType?: AppTypeEnum | null;
  onClearProblem?: (problemId: string) => void;
  hasManagedAppsPermission?: boolean;
  showInline?: boolean;
  modalOpen?: boolean;
  onModalOpenChange?: (open: boolean) => void;
  onFetchAllProblems?: (appId: string) => void;
}

export const sortProblems = (problems: AppProblem[]): AppProblem[] =>
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

export const getActionLink = (
  problem: AppProblem,
  appId: string,
  appType?: AppTypeEnum | null,
): { href: string; label: keyof typeof problemMessages } | null => {
  if (problem.__typename === "WebhookDeliveryError") {
    return {
      href: ExtensionsUrls.resolveEditManifestExtensionUrl(appId),
      label: "checkWebhooks",
    };
  }

  if (problem.__typename === "AppProblem" && appType === AppTypeEnum.THIRDPARTY) {
    return {
      href: ExtensionsUrls.resolveViewManifestExtensionUrl(appId),
      label: "openTheApp",
    };
  }

  return null;
};

const getSeverityClass = ({ dismissed, critical }: { dismissed: boolean; critical: boolean }) => {
  if (dismissed) return styles.severityDismissed;

  if (critical) return styles.severityError;

  return styles.severityWarning;
};

interface ProblemItemProps {
  problem: AppProblem;
  appId: string;
  appType?: AppTypeEnum | null;
  index: number;
  onClearProblem?: (problemId: string) => void;
  hasManagedAppsPermission?: boolean;
}

const ProblemItem = ({
  problem,
  appId,
  appType,
  index,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemItemProps) => {
  const intl = useIntl();
  const critical = isProblemCritical(problem);
  const dismissed = isProblemDismissed(problem);
  const actionLink = getActionLink(problem, appId, appType);
  const canForceClear =
    hasManagedAppsPermission && problem.__typename === "AppProblem" && !!onClearProblem;

  const borderClass = getSeverityClass({ dismissed, critical });

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
      <ProblemCard
        problem={problem}
        dismissed={dismissed}
        onForceClear={
          canForceClear && problem.__typename === "AppProblem"
            ? () => onClearProblem(problem.id)
            : undefined
        }
      />
    </div>
  );
};

export const ProblemsList = ({
  problems,
  appId,
  appType,
  onClearProblem,
  hasManagedAppsPermission,
  showInline = true,
  modalOpen,
  onModalOpenChange,
  onFetchAllProblems,
}: ProblemsListProps) => {
  const intl = useIntl();

  // Modal state can be controlled externally (via modalOpen/onModalOpenChange props from the parent
  // row's "Open app problems" button) or internally (via the inline "Show more" button).
  const [internalPopupOpen, setInternalPopupOpen] = useState(false);

  const isPopupOpen = modalOpen ?? internalPopupOpen;
  const handlePopupChange = (open: boolean) => {
    if (onModalOpenChange) {
      onModalOpenChange(open);
    } else {
      setInternalPopupOpen(open);
    }
  };

  useEffect(() => {
    if (isPopupOpen && onFetchAllProblems) {
      onFetchAllProblems(appId);
    }
  }, [isPopupOpen, onFetchAllProblems, appId]);

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
              appType={appType}
              index={index}
              onClearProblem={onClearProblem}
              hasManagedAppsPermission={hasManagedAppsPermission}
            />
          ))}
          {hasMore && (
            <button
              type="button"
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
                    ? `, ${intl.formatMessage(problemMessages.includingCritical, {
                        count: criticalInHidden,
                      })}`
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
                appType={appType}
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
