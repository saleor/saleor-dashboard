import { Box } from "@saleor/macaw-ui-next";
import { ElementRef, forwardRef, HTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableBodyElement = ElementRef<"tbody">;
type GridTableBodyProps = GridTableProps<HTMLAttributes<HTMLTableSectionElement>>;

export const GridTableBody = forwardRef<GridTableBodyElement, GridTableBodyProps>(
  ({ children, ...props }, forwardedRef) => (
    // @ts-expect-error Types of property contentEditable are incompatible.
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableBody.displayName = "GridTable.Body";
