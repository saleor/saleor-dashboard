import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";

interface DetailPageLayoutRightSidebarProps extends BoxProps {
  children: React.ReactNode;
}

export const RightSidebar: React.FC<DetailPageLayoutRightSidebarProps> = ({
  children,
  ...porps
}) => (
  <Box
    borderLeftStyle="solid"
    borderColor="default1"
    height="100%"
    overflowY="auto"
    className="hide-scrollbar"
    borderLeftWidth={1}
    gridColumn={"8"}
    gridRow={{ mobile: "6", tablet: "full", desktop: "full" }}
    paddingBottom={6}
    {...porps}
  >
    {children}
  </Box>
);
