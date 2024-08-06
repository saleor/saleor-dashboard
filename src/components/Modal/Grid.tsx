import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Grid = ({ children, ...rest }: PropsWithBox<{ children: React.ReactNode }>) => {
  return (
    <Box display="grid" gap={6} width="100%" {...rest}>
      {children}
    </Box>
  );
};
