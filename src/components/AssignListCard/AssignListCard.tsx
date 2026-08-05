import DeletableItem from "@dashboard/components/DeletableItem";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import styles from "./AssignListCard.module.css";

export interface AssignListCardItem {
  id: string;
  name: string;
  href?: string;
  icon?: ReactNode;
}

export interface AssignListCardEmptyState {
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
  disabled?: boolean;
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
  disabled = false,
  "data-test-id": dataTestId,
  rowTestId = "assign-list-row",
  rowLinkTestId = id => `${id}-link`,
}: AssignListCardProps) => {
  const hasItems = items.length > 0;

  return (
    <Box className={styles.card} data-test-id={dataTestId}>
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

      {!hasItems ? (
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
                    <Box className={styles.rowName}>
                      <Text size={3} fontWeight="medium">
                        {item.name}
                      </Text>
                    </Box>
                  )}
                </Box>
                <div className={styles.rowDelete}>
                  <DeletableItem id={item.id} onDelete={onRemoveItem} disabled={disabled} />
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
