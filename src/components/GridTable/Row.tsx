import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

import { GridTableContext } from "./Root";

type GridTableRowElement = React.ElementRef<"tr">;
type GridTableRowProps = PropsWithBox<
  Omit<HTMLAttributes<HTMLTableRowElement>, "color" | "height" | "width">
>;

export const GridTableRow = React.forwardRef<GridTableRowElement, GridTableRowProps>(
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
