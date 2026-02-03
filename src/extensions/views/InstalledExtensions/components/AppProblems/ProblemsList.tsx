import Link from "@dashboard/components/Link";
import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem, getProblemSeverity, ProblemSeverity } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { ChevronDown, ChevronUp, CircleAlert, ExternalLink, TriangleAlert } from "lucide-react";
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

interface SeverityTypeGroup {
  typename: AppProblem["__typename"];
  severity: ProblemSeverity;
  items: AppProblem[];
}

const groupBySeverityAndType = (problems: AppProblem[]): SeverityTypeGroup[] => {
  const groups: SeverityTypeGroup[] = [];

  // Error groups first
  const errorProblems = problems.filter(p => getProblemSeverity(p) === "critical");
  const warningProblems = problems.filter(p => getProblemSeverity(p) === "warning");

  const addTypeGroups = (source: AppProblem[], severity: ProblemSeverity) => {
    const webhook = source.filter(p => p.__typename === "WebhookDeliveryError");
    const own = source.filter(p => p.__typename === "AppProblem");

    if (webhook.length > 0) {
      groups.push({ typename: "WebhookDeliveryError", severity, items: webhook });
    }

    if (own.length > 0) {
      groups.push({ typename: "AppProblem", severity, items: own });
    }
  };

  addTypeGroups(errorProblems, "critical");
  addTypeGroups(warningProblems, "warning");

  return groups;
};

const getGroupActionLink = (
  typename: AppProblem["__typename"],
  appId: string,
): { href: string; label: keyof typeof problemMessages } | null => {
  if (typename === "WebhookDeliveryError") {
    return {
      href: ExtensionsUrls.resolveEditManifestExtensionUrl(appId),
      label: "checkWebhooks",
    };
  }

  if (typename === "AppProblem") {
    return {
      href: ExtensionsUrls.resolveViewManifestExtensionUrl(appId),
      label: "openTheApp",
    };
  }

  return null;
};

interface ProblemGroupSectionProps {
  typename: AppProblem["__typename"];
  severity: ProblemSeverity;
  problems: AppProblem[];
  appId: string;
  onClearProblem?: (appId: string, keys?: string[]) => void;
  hasManagedAppsPermission?: boolean;
}

const ProblemGroupSection = ({
  typename,
  severity,
  problems,
  appId,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemGroupSectionProps) => {
  const intl = useIntl();

  if (problems.length === 0) {
    return null;
  }

  const actionLink = getGroupActionLink(typename, appId);
  const isError = severity === "critical";
  const SeverityIcon = isError ? CircleAlert : TriangleAlert;
  const iconClass = isError ? styles.errorIcon : styles.warningIcon;
  const canForceClear = hasManagedAppsPermission && typename === "AppProblem" && !!onClearProblem;

  return (
    <>
      <div className={styles.groupHeader}>
        <SeverityIcon size={16} className={iconClass} />
        <ProblemTypeBadge typename={typename} />
        {actionLink && (
          <Link href={actionLink.href} className={styles.groupActionLink} inline={false}>
            {intl.formatMessage(problemMessages[actionLink.label])}
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
      {problems.map(problem => (
        <ProblemCard
          key={
            problem.__typename === "AppProblem"
              ? `${problem.key}-${problem.createdAt}`
              : problem.createdAt
          }
          problem={problem}
          onForceClear={
            canForceClear && problem.__typename === "AppProblem"
              ? () => onClearProblem(appId, [problem.key])
              : undefined
          }
        />
      ))}
    </>
  );
};

/** Build an ordered flat list following severity+type priority, then slice to limit */
const getVisibleGroups = (allGroups: SeverityTypeGroup[], limit: number): SeverityTypeGroup[] => {
  let remaining = limit;
  const result: SeverityTypeGroup[] = [];

  for (const group of allGroups) {
    if (remaining <= 0 || group.items.length === 0) {
      continue;
    }

    result.push({
      ...group,
      items: group.items.slice(0, remaining),
    });
    remaining -= group.items.length;
  }

  return result;
};

export const ProblemsList = ({
  problems,
  appId,
  onClearProblem,
  hasManagedAppsPermission,
}: ProblemsListProps) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  const allGroups = useMemo(() => groupBySeverityAndType(problems), [problems]);

  if (problems.length === 0) {
    return null;
  }

  const hiddenCount = problems.length - MAX_VISIBLE_PROBLEMS;
  const hasMore = hiddenCount > 0;

  const nonEmptyGroups = expanded
    ? allGroups.filter(g => g.items.length > 0)
    : getVisibleGroups(allGroups, MAX_VISIBLE_PROBLEMS);

  return (
    <div className={styles.problemsContainer}>
      {nonEmptyGroups.map((group, groupIndex) => (
        <div
          key={`${group.severity}-${group.typename}`}
          className={group.severity === "critical" ? styles.severityError : styles.severityWarning}
        >
          {groupIndex > 0 && <hr className={styles.groupDivider} />}
          <ProblemGroupSection
            typename={group.typename}
            severity={group.severity}
            problems={group.items}
            appId={appId}
            onClearProblem={onClearProblem}
            hasManagedAppsPermission={hasManagedAppsPermission}
          />
        </div>
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
