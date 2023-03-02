import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface DetailPageLayoutRightSidebarProps {
  children: React.ReactNode;
}

export const RightSidebar: React.FC<DetailPageLayoutRightSidebarProps> = ({
  children,
}) => (
  <Box
    borderLeftStyle="solid"
    borderColor="neutralPlain"
    height="100%"
    overflowY="auto"
    className="hide-scrollbar"
    borderLeftWidth={1}
    gridColumn={"8"}
    gridRow={{ mobile: "6", tablet: "full", desktop: "full" }}
  >
    {children}
  </Box>
);
