import { Box } from "@saleor/macaw-ui-next";
import { HTMLAttributes } from "react";
import * as React from "react";

import { GridTableProps } from "./types";

type GridTableRowElement = React.ElementRef<"tr">;
type GridTableRowProps = GridTableProps<HTMLAttributes<HTMLTableRowElement>>;

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
