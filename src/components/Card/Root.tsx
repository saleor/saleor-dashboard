import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Root: React.FC<PropsWithBox<{ children: React.ReactNode }>> = ({
  children,
  ...rest
}) => (
  <Box display="flex" flexDirection="column" gap={5} backgroundColor="default1" {...rest}>
    {children}
  </Box>
);
