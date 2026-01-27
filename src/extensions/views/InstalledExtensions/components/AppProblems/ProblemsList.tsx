import Link from "@dashboard/components/Link";
import { problemMessages } from "@dashboard/extensions/messages";
import { AppProblem } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { ChevronDown, ChevronUp, ExternalLink, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import styles from "./AppProblems.module.css";
import { ProblemCard } from "./ProblemCard";
import { ProblemTypeBadge } from "./ProblemTypeBadge";

const MAX_VISIBLE_PROBLEMS = 3;

interface ProblemsListProps {
  problems: AppProblem[];
  appId: string;
}

interface ProblemGroups {
  circuitBreaker: AppProblem[];
  custom: AppProblem[];
  webhook: AppProblem[];
}

const groupProblems = (problems: AppProblem[]): ProblemGroups => {
  const circuitBreaker = problems.filter(p => p.__typename === "AppProblemCircuitBreaker");
  const custom = problems.filter(p => p.__typename === "AppProblemCustom");
  const webhook = problems.filter(p => p.__typename === "WebhookDeliveryError");

  return { circuitBreaker, custom, webhook };
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

  if (typename === "AppProblemCustom") {
    return {
      href: ExtensionsUrls.resolveViewManifestExtensionUrl(appId),
      label: "openTheApp",
    };
  }

  return null;
};

interface ProblemGroupSectionProps {
  typename: AppProblem["__typename"];
  problems: AppProblem[];
  appId: string;
}

const ProblemGroupSection = ({ typename, problems, appId }: ProblemGroupSectionProps) => {
  const intl = useIntl();

  if (problems.length === 0) {
    return null;
  }

  const actionLink = getGroupActionLink(typename, appId);

  return (
    <>
      <div className={styles.groupHeader}>
        <TriangleAlert size={16} className={styles.warningIcon} />
        <ProblemTypeBadge typename={typename} />
        {actionLink && (
          <Link
            href={actionLink.href}
            className={styles.groupActionLink}
            onClick={e => e.stopPropagation()}
          >
            {intl.formatMessage(problemMessages[actionLink.label])}
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
      {problems.map((problem, index) => (
        <ProblemCard key={index} problem={problem} />
      ))}
    </>
  );
};

export const ProblemsList = ({ problems, appId }: ProblemsListProps) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  const allGroups = useMemo(() => groupProblems(problems), [problems]);

  if (problems.length === 0) {
    return null;
  }

  const visibleProblems = expanded ? problems : problems.slice(0, MAX_VISIBLE_PROBLEMS);
  const hiddenCount = problems.length - MAX_VISIBLE_PROBLEMS;
  const hasMore = hiddenCount > 0;

  const visibleGroups = expanded ? allGroups : groupProblems(visibleProblems);

  const groupEntries: Array<{ typename: AppProblem["__typename"]; items: AppProblem[] }> = [
    { typename: "AppProblemCircuitBreaker", items: visibleGroups.circuitBreaker },
    { typename: "WebhookDeliveryError", items: visibleGroups.webhook },
    { typename: "AppProblemCustom", items: visibleGroups.custom },
  ];

  const nonEmptyGroups = groupEntries.filter(g => g.items.length > 0);

  return (
    <div className={styles.problemsContainer}>
      {nonEmptyGroups.map((group, groupIndex) => (
        <div key={group.typename}>
          {groupIndex > 0 && <hr className={styles.groupDivider} />}
          <ProblemGroupSection typename={group.typename} problems={group.items} appId={appId} />
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
