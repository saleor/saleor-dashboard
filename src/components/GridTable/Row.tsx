import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

import { GridTableContext } from "./Root";

type GridTableRowElement = React.ElementRef<"tr">;

export const GridTableRow = React.forwardRef<GridTableRowElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    const ctx = React.useContext(GridTableContext);

    if (!ctx) {
      throw new Error("GridTableRow must be used within a GridTableRoot");
    }

    const backgroundColor = ctx.striped ? { evenChild: "default2" as const } : undefined;

    return (
      <Box as="tr" ref={forwardedRef} backgroundColor={backgroundColor} {...props}>
        {children}
      </Box>
    );
  },
);
GridTableRow.displayName = "GridTable.Row";
