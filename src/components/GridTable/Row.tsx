import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

type GridTableRowElement = React.ElementRef<"tr">;
type GridTableRowProps = PropsWithBox<
  Omit<HTMLAttributes<HTMLTableRowElement>, "color" | "height" | "width">
>;

export const GridTableRow = React.forwardRef<GridTableRowElement, GridTableRowProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Box as="tr" ref={forwardedRef} {...props}>
        {children}
      </Box>
    );
  },
);
GridTableRow.displayName = "GridTable.Row";
