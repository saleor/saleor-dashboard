import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import * as React from "react";

export const Content = ({ children, ...rest }: PropsWithBox<{ children?: React.ReactNode }>) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
