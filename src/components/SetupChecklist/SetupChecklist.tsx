import { getDotColor } from "@dashboard/misc";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Check, ChevronDown, Circle, Lock } from "lucide-react";
import { type KeyboardEvent, type MouseEvent, type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./SetupChecklist.module.css";
import { SetupChecklistReviewList } from "./SetupChecklistReviewList";
import {
  type SetupChecklistProps,
  type SetupChecklistReviewSection,
  type SetupChecklistSectionHeader,
  type SetupChecklistTask,
  type SetupChecklistTaskStatus,
} from "./types";

export const SetupChecklistBadge = ({ children }: { children: ReactNode }) => (
  <Box as="span" className={styles.badge}>
    {children}
  </Box>
);

const StatusIcon = ({ status }: { status: SetupChecklistTaskStatus }) => {
  const { themeValues } = useTheme();

  if (status === "completed") {
    // Macaw success1 is a dark text token / muted surface — not a usable fill.
    // Same vivid green StatusDot uses (pending success2 in Macaw).
    return (
      <Box className={styles.statusIcon} aria-hidden>
        <Box
          className={styles.completedIcon}
          __backgroundColor={getDotColor("success", themeValues)}
          color="buttonDefaultPrimary"
          aria-hidden
        >
          <Check size={11} strokeWidth={3} />
        </Box>
      </Box>
    );
  }

  if (status === "locked") {
    return (
      <Box className={styles.statusIcon} color="default2" aria-hidden>
        <Box className={styles.lockedIcon} aria-hidden>
          <Lock size={10} strokeWidth={2.5} />
        </Box>
      </Box>
    );
  }

  // Optional guidance rows aren't todos — a bullet, not an empty checkbox.
  if (status === "optional") {
    return (
      <Box className={styles.statusIcon} aria-hidden>
        <Box className={styles.optionalIcon} aria-hidden />
      </Box>
    );
  }

  return (
    <Box
      className={styles.statusIcon}
      color={status === "active" ? "default1" : "default2"}
      aria-hidden
    >
      <Circle size={18} strokeWidth={1.75} />
    </Box>
  );
};

const getDefaultProgress = (tasks: SetupChecklistProps["tasks"]) => ({
  done: tasks.filter(task => task.status === "completed").length,
  total: tasks.length,
});

const getDefaultExpandedId = (tasks: SetupChecklistTask[]): string | null =>
  tasks.find(task => task.status === "active" && task.details != null)?.id ?? null;

interface SetupTaskListProps {
  tasks: SetupChecklistTask[];
  initialExpandedId: string | null;
  afterSectionHeader?: boolean;
}

const SetupTaskList = ({
  tasks,
  initialExpandedId,
  afterSectionHeader = false,
}: SetupTaskListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId);

  const toggleTask = (taskId: string) => {
    setExpandedId(current => (current === taskId ? null : taskId));
  };

  return (
    <Box
      as="ul"
      className={clsx(styles.taskList, {
        [styles.taskListAfterSection]: afterSectionHeader,
      })}
    >
      {tasks.map(task => {
        const hasDetails = task.details != null;
        const isExpanded = hasDetails && expandedId === task.id;

        const handleContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTask(task.id);
          }
        };

        return (
          <Box
            as="li"
            key={task.id}
            className={clsx(styles.task, {
              [styles.taskActive]: task.status === "active",
              [styles.taskLocked]: task.status === "locked",
              [styles.taskCompleted]: task.status === "completed",
            })}
            data-test-id={`setup-checklist-task-${task.id}`}
            data-status={task.status}
            data-expanded={isExpanded ? "true" : "false"}
          >
            <Box
              className={styles.taskHeader}
              data-test-id={`setup-checklist-task-trigger-${task.id}`}
            >
              <Box className={styles.taskLeading}>
                <StatusIcon status={task.status} />
                {hasDetails ? (
                  <button
                    type="button"
                    className={styles.chevronButton}
                    onClick={() => toggleTask(task.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    data-test-id={`setup-checklist-task-expand-${task.id}`}
                  >
                    <Box
                      className={clsx(styles.chevron, {
                        [styles.chevronExpanded]: isExpanded,
                        [styles.chevronCollapsed]: !isExpanded,
                      })}
                      aria-hidden
                    >
                      <ChevronDown size={14} strokeWidth={2} />
                    </Box>
                  </button>
                ) : (
                  <Box className={styles.chevronSpacer} aria-hidden />
                )}
              </Box>
              <Box
                className={clsx(styles.taskContent, {
                  [styles.taskContentExpandable]: hasDetails,
                })}
                onClick={hasDetails ? () => toggleTask(task.id) : undefined}
                role={hasDetails ? "button" : undefined}
                tabIndex={hasDetails ? 0 : undefined}
                onKeyDown={hasDetails ? handleContentKeyDown : undefined}
              >
                <Box className={styles.taskHeading}>
                  <Text size={3} fontWeight="medium" className={styles.taskTitle}>
                    {task.title}
                  </Text>
                  {task.requirement && (
                    <Box as="span" className={styles.requirementBadge}>
                      {task.requirement}
                    </Box>
                  )}
                </Box>
                <Text size={2} color="default2">
                  {task.description}
                </Text>
              </Box>
              {task.action != null && (
                <Box
                  className={styles.taskAction}
                  onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
                >
                  {task.action}
                </Box>
              )}
            </Box>
            {hasDetails && isExpanded && (
              <Box
                className={styles.taskDetails}
                data-test-id={`setup-checklist-task-details-${task.id}`}
              >
                <Box className={styles.taskDetailsBody}>
                  {task.detailsIcon && (
                    <Box className={styles.taskDetailsIcon} aria-hidden>
                      {task.detailsIcon}
                    </Box>
                  )}
                  <Text size={2} color="default2">
                    {task.details}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const SetupSectionHeader = ({
  title,
  subtitle,
  "data-test-id": dataTestId,
}: SetupChecklistSectionHeader & { "data-test-id"?: string }) => (
  <Box className={styles.sectionHeader} data-test-id={dataTestId}>
    <Text as="h3" className={styles.sectionTitle}>
      {title}
    </Text>
    {subtitle && (
      <Text size={2} color="default2">
        {subtitle}
      </Text>
    )}
  </Box>
);

const SetupReviewSection = ({ title, subtitle, items }: SetupChecklistReviewSection) => (
  <SetupChecklistReviewList
    title={title}
    subtitle={subtitle}
    items={items}
    data-test-id="setup-checklist-review"
  />
);

export const SetupChecklist = ({
  title,
  subtitle,
  badge,
  progress,
  tasksSection,
  tasks,
  reviewSection,
  nextUp,
  footerActions,
  className,
  "data-test-id": dataTestId = "setup-checklist",
}: SetupChecklistProps) => {
  const resolvedProgress = progress ?? getDefaultProgress(tasks);
  const defaultExpandedId = getDefaultExpandedId(tasks);

  return (
    <Box className={clsx(styles.card, className)} data-test-id={dataTestId}>
      <Box className={styles.header}>
        <Box className={styles.titleRow}>
          <Text size={6} fontWeight="bold" as="h2">
            {title}
          </Text>
          {badge}
          <Text
            size={2}
            color="default2"
            className={styles.progressCount}
            data-test-id="setup-checklist-progress"
            aria-label={`${resolvedProgress.done} of ${resolvedProgress.total}`}
          >
            <FormattedMessage
              id="RvRHDy"
              defaultMessage="{done} of {total}"
              description="setup checklist progress counter"
              values={{ done: resolvedProgress.done, total: resolvedProgress.total }}
            />
          </Text>
        </Box>
        {subtitle && (
          <Text size={3} color="default2">
            {subtitle}
          </Text>
        )}
      </Box>

      {tasksSection && (
        <SetupSectionHeader
          title={tasksSection.title}
          subtitle={tasksSection.subtitle}
          data-test-id="setup-checklist-tasks-section"
        />
      )}

      <SetupTaskList
        key={defaultExpandedId ?? "none"}
        tasks={tasks}
        initialExpandedId={defaultExpandedId}
        afterSectionHeader={!!tasksSection}
      />

      {reviewSection && reviewSection.items.length > 0 && (
        <SetupReviewSection
          title={reviewSection.title}
          subtitle={reviewSection.subtitle}
          items={reviewSection.items}
        />
      )}

      {(nextUp || footerActions) && (
        <Box className={styles.footer}>
          <Box minWidth={0} flexGrow="1">
            {nextUp && (
              <Text size={2} color="default2" data-test-id="setup-checklist-next-up">
                {nextUp}
              </Text>
            )}
          </Box>
          {footerActions && <Box className={styles.footerActions}>{footerActions}</Box>}
        </Box>
      )}
    </Box>
  );
};
