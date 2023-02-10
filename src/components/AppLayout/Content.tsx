import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface ContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children, ...rest }) => (
  <Box {...rest}>{children}</Box>
);
