import { Box } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableBodyElement = React.ElementRef<"tbody">;
type GridTableBodyProps = GridTableProps<HTMLAttributes<HTMLTableSectionElement>>;

export const GridTableBody = React.forwardRef<GridTableBodyElement, GridTableBodyProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableBody.displayName = "GridTable.Body";
