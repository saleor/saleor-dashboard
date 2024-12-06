import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import * as React from "react";

export const Toolbar = ({ children, ...rest }: PropsWithBox<{ children: React.ReactNode }>) => (
  <Box display="flex" flexDirection="row" gap={2} {...rest}>
    {children}
  </Box>
);
