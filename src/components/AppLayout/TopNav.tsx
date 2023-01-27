import { Box } from "@saleor/macaw-ui/next";
import React, { PropsWithChildren } from "react";

interface TopNavProps {
  title: string | React.ReactNode;
  href?: string;
}

export const TopNav: React.FC<PropsWithChildren<TopNavProps>> = ({
  title,
  href,
  children,
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    paddingX={9}
    paddingY={7}
    borderBottomWidth={1}
    borderBottomStyle="solid"
    borderColor="neutralPlain"
    __gridArea="nav"
  >
    <Box>
      href: {href}
      title: {title}
    </Box>
    <Box>{children}</Box>
  </Box>
);
