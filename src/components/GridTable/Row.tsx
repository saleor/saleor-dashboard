import { Box } from "@saleor/macaw-ui-next";
import { ElementRef, forwardRef, HTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableRowElement = ElementRef<"tr">;
type GridTableRowProps = GridTableProps<HTMLAttributes<HTMLTableRowElement>>;

export const GridTableRow = forwardRef<GridTableRowElement, GridTableRowProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      // @ts-expect-error Types of property contentEditable are incompatible.
      <Box as="tr" ref={forwardedRef} {...props}>
        {children}
      </Box>
    );
  },
);
GridTableRow.displayName = "GridTable.Row";
