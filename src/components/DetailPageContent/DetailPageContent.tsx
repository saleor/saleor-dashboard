import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

interface DetailPageContentProps extends Omit<BoxProps, "children"> {
  children: ReactNode;
}

/**
 * Main-column stack for entity detail pages — shared padding and vertical gap
 * between DetailSettingsCard / SEO / list sections.
 */
export const DetailPageContent = ({ children, ...rest }: DetailPageContentProps): JSX.Element => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingX={6}
    paddingTop={6}
    paddingBottom={6}
    {...rest}
  >
    {children}
  </Box>
);
