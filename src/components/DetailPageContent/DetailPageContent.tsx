import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./DetailPageContent.module.css";

interface DetailPageContentProps extends Omit<BoxProps, "children"> {
  children: ReactNode;
}

/**
 * Main-column stack for entity detail pages without a section nav rail.
 * Applies shared padding and vertical gap between DetailSettingsCard / SEO / list sections.
 *
 * When the page uses `DetailPageSectionLayout` + `DetailSectionNav`, render sections
 * directly in the layout's main column instead — do not nest this component there
 * (it would double horizontal padding and shrink the nav/content ratio).
 */
export const DetailPageContent = ({
  children,
  className,
  ...rest
}: DetailPageContentProps): JSX.Element => (
  <Box
    className={clsx(styles.root, className)}
    display="flex"
    flexDirection="column"
    gap={4}
    paddingTop={6}
    paddingBottom={6}
    {...rest}
  >
    {children}
  </Box>
);
