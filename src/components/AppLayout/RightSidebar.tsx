import { Box } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

import { borderHeight, savebarHeight } from "./consts";

interface RightSidebarProps {
  children: React.ReactNode;
  className?: string;
  noSavebar?: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  children,
  noSavebar = false,
  className,
}) => (
  <Box
    borderStyle="solid"
    borderColor="neutralPlain"
    borderLeftWidth={1}
    __height={noSavebar ? "100%" : `calc(100vh - ${savebarHeight} - ${borderHeight})`}
    position="sticky"
    top={0}
    overflowY="auto"
    borderYWidth={0}
    borderTopWidth={0}
    borderBottomWidth={0}
    borderRightWidth={0}
    __gridArea="right"
    className={clsx("hide-scrollbar", className)}
  >
    {children}
  </Box>
);
