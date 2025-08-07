import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Toolbar = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box display="flex" flexDirection="row" gap={2} {...rest}>
    {children}
  </Box>
);
