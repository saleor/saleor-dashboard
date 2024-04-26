import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableColElement = React.ElementRef<"thead">;

export const GridTableCol = React.forwardRef<GridTableColElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableCol.displayName = "GridTable.Col";
