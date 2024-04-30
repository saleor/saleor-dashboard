import { Box } from "@saleor/macaw-ui-next";
import React, { ColHTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableColElement = React.ElementRef<"col">;
type GridTableColProps = GridTableProps<ColHTMLAttributes<HTMLTableColElement>>;

export const GridTableCol = React.forwardRef<GridTableColElement, GridTableColProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableCol.displayName = "GridTable.Col";
