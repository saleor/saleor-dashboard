import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

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
export const DetailPageContent = ({ children, ...rest }: DetailPageContentProps): JSX.Element => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingX={{ mobile: 3, tablet: 6, desktop: 6 }}
    paddingTop={6}
    paddingBottom={6}
    {...rest}
  >
    {children}
  </Box>
);
