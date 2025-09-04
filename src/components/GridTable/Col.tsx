import { Box } from "@saleor/macaw-ui-next";
import { ColHTMLAttributes, forwardRef } from "react";

import { GridTableProps } from "./types";

type GridTableColElement = React.ElementRef<"col">;
type GridTableColProps = GridTableProps<ColHTMLAttributes<HTMLTableColElement>>;

export const GridTableCol = forwardRef<GridTableColElement, GridTableColProps>(
  ({ children, ...props }, forwardedRef) => (
    // @ts-expect-error - wrong types with refs
    (<Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>)
  ),
);
GridTableCol.displayName = "GridTable.Col";
