import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";

export const PaginationDatagridWrapper = ({ children, ...props }: BoxProps) => (
  <Box
    padding={4}
    paddingRight={6}
    __paddingBottom={150} // TODO: remove when macaw-ui select's dropdown position is fixed
    {...props}
  >
    {children}
  </Box>
);
