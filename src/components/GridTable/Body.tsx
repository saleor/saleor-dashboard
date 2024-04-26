import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableBodyElement = React.ElementRef<"tbody">;

export const GridTableBody = React.forwardRef<GridTableBodyElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableBody.displayName = "GridTable.Body";
