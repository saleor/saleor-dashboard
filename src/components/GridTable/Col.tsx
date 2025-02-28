import { Box } from "@saleor/macaw-ui-next";
import { ColHTMLAttributes, ElementRef, forwardRef } from "react";

import { GridTableProps } from "./types";

type GridTableColElement = ElementRef<"col">;
type GridTableColProps = GridTableProps<ColHTMLAttributes<HTMLTableColElement>>;

export const GridTableCol = forwardRef<GridTableColElement, GridTableColProps>(
  ({ children, ...props }, forwardedRef) => (
    // @ts-expect-error Types of property contentEditable are incompatible.
    <Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableCol.displayName = "GridTable.Col";
