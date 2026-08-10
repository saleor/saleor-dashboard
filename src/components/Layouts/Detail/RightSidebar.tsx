import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import type * as React from "react";

interface DetailPageLayoutRightSidebarProps extends BoxProps {
  children: React.ReactNode;
}

export const RightSidebar = ({ children, ...props }: DetailPageLayoutRightSidebarProps) => (
  <Box
    borderLeftStyle="solid"
    borderColor="default1"
    height="100%"
    overflowY="auto"
    className="hide-scrollbar"
    borderLeftWidth={{ mobile: 0, tablet: 1, desktop: 1 }}
    gridColumn={"8"}
    gridRow={{ mobile: "6", tablet: "full", desktop: "full" }}
    paddingBottom={6}
    {...props}
  >
    {children}
  </Box>
);
