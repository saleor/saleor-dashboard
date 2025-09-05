import { Box } from "@saleor/macaw-ui-next";
import { forwardRef,HTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableRowElement = React.ElementRef<"tr">;
type GridTableRowProps = GridTableProps<HTMLAttributes<HTMLTableRowElement>>;

export const GridTableRow = forwardRef<GridTableRowElement, GridTableRowProps>(
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
