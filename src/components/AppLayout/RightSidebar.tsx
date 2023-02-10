import { Box } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

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
    height="100vh"
    __paddingBottom={300}
    position="sticky"
    top={0}
    overflowY="scroll"
    overflowX="hidden"
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
