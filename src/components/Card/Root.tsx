import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Root = ({ children, ...rest }: PropsWithBox<{ children: React.ReactNode }>) => (
  <Box display="flex" flexDirection="column" gap={5} backgroundColor="default1" {...rest}>
    {children}
  </Box>
);
