import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Content = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
