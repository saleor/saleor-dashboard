import DeletableItem from "@dashboard/components/DeletableItem";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import styles from "./AssignListCard.module.css";

interface AssignListCardItem {
  id: string;
  name: string;
  href?: string;
  icon?: ReactNode;
  /** Secondary line under the name (section, status, email). */
  description?: ReactNode;
}

interface AssignListCardEmptyState {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

interface AssignListCardProps {
  title: ReactNode;
  subtitle: ReactNode;
  intro: ReactNode;
  items: AssignListCardItem[];
  emptyState: AssignListCardEmptyState;
  footerAction?: ReactNode;
  onRemoveItem: (id: string) => void;
  /** Tooltip / aria-label on the row trash control. */
  removeLabel?: string;
  disabled?: boolean;
  /** Names are still resolving — skeleton rows instead of empty/list. */
  loading?: boolean;
  /**
   * `sidebar` (default) insets the card to match channel ops cards.
   * `flush` when the parent already applies that inset (account settings stack).
   */
  inset?: "sidebar" | "flush";
  "data-test-id"?: string;
  rowTestId?: string;
  rowLinkTestId?: (id: string) => string;
}

export const AssignListCard = ({
  title,
  subtitle,
  intro,
  items,
  emptyState,
  footerAction,
  onRemoveItem,
  removeLabel,
  disabled = false,
  loading = false,
  inset = "sidebar",
  "data-test-id": dataTestId,
  rowTestId = "assign-list-row",
  rowLinkTestId = (id: string): string => `${id}-link`,
}: AssignListCardProps): JSX.Element => {
  const hasItems = items.length > 0;

  return (
    <Box
      className={clsx(styles.card, inset === "flush" && styles.cardFlush)}
      data-test-id={dataTestId}
    >
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          {title}
        </Text>
        <Text size={2} color="default2">
          {subtitle}
        </Text>
      </Box>

      <Box className={styles.intro}>
        <Text size={3} color="default2">
          {intro}
        </Text>
      </Box>

      {loading ? (
        <Box
          className={styles.list}
          aria-busy="true"
          data-test-id={dataTestId ? `${dataTestId}-loading` : undefined}
        >
          <Box className={styles.row}>
            <Skeleton __height="1.25rem" __width="40%" />
          </Box>
          <Box className={styles.row}>
            <Skeleton __height="1.25rem" __width="55%" />
          </Box>
        </Box>
      ) : !hasItems ? (
        <Box className={styles.emptyState}>
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              {emptyState.icon}
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                {emptyState.title}
              </Text>
              <Text size={2} color="default2">
                {emptyState.description}
              </Text>
            </Box>
          </Box>
          {footerAction ? <Box className={styles.emptyAction}>{footerAction}</Box> : null}
        </Box>
      ) : (
        <>
          <div className={styles.list}>
            {items.map(item => (
              <div key={item.id} className={styles.row} data-test-id={rowTestId}>
                <Box className={styles.rowLeading}>
                  {item.icon ? (
                    <Box className={styles.itemIcon} aria-hidden>
                      {item.icon}
                    </Box>
                  ) : null}
                  <Box className={styles.rowCopy}>
                    {item.href ? (
                      <RouterLink
                        to={item.href}
                        className={styles.rowName}
                        data-test-id={rowLinkTestId(item.id)}
                      >
                        <Text size={3} fontWeight="medium">
                          {item.name}
                        </Text>
                      </RouterLink>
                    ) : (
                      <Text size={3} fontWeight="medium">
                        {item.name}
                      </Text>
                    )}
                    {item.description ? (
                      <Text size={2} color="default2">
                        {item.description}
                      </Text>
                    ) : null}
                  </Box>
                </Box>
                <div className={styles.rowDelete}>
                  <DeletableItem
                    id={item.id}
                    onDelete={onRemoveItem}
                    disabled={disabled}
                    label={removeLabel}
                  />
                </div>
              </div>
            ))}
          </div>
          {footerAction ? (
            <Box className={styles.listFooter}>
              <Box className={styles.listFooterAction}>{footerAction}</Box>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};

AssignListCard.displayName = "AssignListCard";
