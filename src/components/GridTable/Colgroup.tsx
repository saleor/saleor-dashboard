import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableColgroupElement = React.ElementRef<"colgroup">;

export const GridTableColgroup = React.forwardRef<GridTableColgroupElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="colgroup" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableColgroup.displayName = "GridTable.Colgroup";
