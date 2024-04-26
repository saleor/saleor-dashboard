import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableCellElement = React.ElementRef<"td">;

export const GridTableCell = React.forwardRef<GridTableCellElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Box
        as="td"
        ref={forwardedRef}
        height="100%"
        borderStyle="solid"
        borderColor="default1"
        padding={2}
        borderLeftStyle={{ firstChild: "none", default: "solid" }}
        borderRightStyle={{ lastChild: "none", default: "solid" }}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
GridTableCell.displayName = "GridTable.Cell";
