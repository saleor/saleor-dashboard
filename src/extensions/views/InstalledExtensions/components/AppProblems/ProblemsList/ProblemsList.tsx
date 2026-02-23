import { DashboardModal } from "@dashboard/components/Modal";
import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem, isProblemCritical, isProblemDismissed } from "@dashboard/extensions/types";
import { AppTypeEnum } from "@dashboard/graphql";
import { Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { ProblemCard } from "../ProblemCard/ProblemCard";
import { sortProblems } from "../utils";
import styles from "./ProblemsList.module.css";

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
            <ProblemCard
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
              <ProblemCard
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
