import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableHeaderElement = React.ElementRef<"thead">;

export const GridTableHeader = React.forwardRef<GridTableHeaderElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="thead" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableHeader.displayName = "GridTable.Header";
