import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./AssignableListCard.module.css";

interface AssignableListCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  intro?: ReactNode;
  headerEnd?: ReactNode;
  /** Search field. Padding and the divider below are owned by this card. */
  search?: ReactNode;
  children: ReactNode;
  /** Pagination or other footer. `AssignableListPagination` already draws the top border. */
  footer?: ReactNode;
  "data-test-id"?: string;
}

/**
 * Flush `DetailSettingsCard` for in-card assignable lists.
 * Owns search-band padding and composes table + pagination so views do not
 * re-decide header, search, or footer chrome.
 */
export const AssignableListCard = ({
  title,
  subtitle,
  intro,
  headerEnd,
  search,
  children,
  footer,
  "data-test-id": dataTestId,
}: AssignableListCardProps): JSX.Element => (
  <DetailSettingsCard
    title={title}
    subtitle={subtitle}
    intro={intro}
    headerEnd={headerEnd}
    contentFlush
    data-test-id={dataTestId}
  >
    {search ? (
      <Box className={styles.search} data-test-id="assignable-list-search">
        {search}
      </Box>
    ) : null}
    {children}
    {footer}
  </DetailSettingsCard>
);

AssignableListCard.displayName = "AssignableListCard";
