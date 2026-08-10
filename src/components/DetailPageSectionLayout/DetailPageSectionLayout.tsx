import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./DetailPageSectionLayout.module.css";

/** Sticky section-nav rail width — keep in sync with channel details. */
export const DETAIL_PAGE_SECTION_NAV_WIDTH = "25%";

/** Minimum nav rail width before the main column takes the rest. */
export const DETAIL_PAGE_SECTION_NAV_MIN_WIDTH = "10rem";

interface DetailPageSectionLayoutProps {
  nav: ReactNode;
  children: ReactNode;
}

/**
 * Two-column entity detail layout: sticky `DetailSectionNav` rail + main sections.
 * Canonical reference: channel details (`ChannelDetailsPage`).
 *
 * Do not wrap `children` in `DetailPageContent` — this layout owns outer padding once.
 * Use `DetailPageContent` only on single-column detail pages without section nav.
 */
export const DetailPageSectionLayout = ({
  nav,
  children,
}: DetailPageSectionLayoutProps): JSX.Element => (
  <Box className={styles.root} display="flex" gap={4} paddingTop={6} paddingBottom={6}>
    <Box
      display={{ mobile: "none", tablet: "block", desktop: "block" }}
      flexShrink="0"
      __width={DETAIL_PAGE_SECTION_NAV_WIDTH}
      __minWidth={DETAIL_PAGE_SECTION_NAV_MIN_WIDTH}
    >
      {nav}
    </Box>
    <Box flexGrow="1" __minWidth="0" display="flex" flexDirection="column" gap={4}>
      {children}
    </Box>
  </Box>
);
