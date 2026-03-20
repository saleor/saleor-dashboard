import { Box } from "@saleor/macaw-ui-next";
import { type HTMLAttributes } from "react";
import * as React from "react";

import { type GridTableProps } from "./types";

type GridTableRowElement = React.ElementRef<"tr">;
type GridTableRowProps = GridTableProps<HTMLAttributes<HTMLTableRowElement>>;

export const GridTableRow = React.forwardRef<GridTableRowElement, GridTableRowProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      // @ts-expect-error - incorrect types
      <Box as="tr" ref={forwardedRef} {...props}>
        {children}
      </Box>
    );
  },
);
GridTableRow.displayName = "GridTable.Row";
