import { Box } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

import { savebarHeight } from "./consts";

interface RightSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  children,
  className,
}) => (
  <Box
    borderStyle="solid"
    borderColor="neutralPlain"
    borderLeftWidth={1}
    __height={`calc(100vh - ${savebarHeight})`}
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
