import { Box } from "@saleor/macaw-ui-next";
import { HTMLAttributes } from "react";
import * as React from "react";

import { GridTableProps } from "./types";

type GridTableBodyElement = React.ElementRef<"tbody">;
type GridTableBodyProps = GridTableProps<HTMLAttributes<HTMLTableSectionElement>>;

export const GridTableBody = React.forwardRef<GridTableBodyElement, GridTableBodyProps>(
  ({ children, ...props }, forwardedRef) => (
    // @ts-expect-error - incorrect types
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableBody.displayName = "GridTable.Body";
