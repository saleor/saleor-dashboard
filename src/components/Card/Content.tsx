import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Content: React.FC<PropsWithBox<{ children?: React.ReactNode }>> = ({
  children,
  ...rest
}) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
