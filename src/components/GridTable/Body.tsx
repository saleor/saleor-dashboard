import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

type GridTableBodyElement = React.ElementRef<"tbody">;
type GridTableBodyProps = PropsWithBox<Omit<HTMLAttributes<HTMLTableSectionElement>, "color">>;

export const GridTableBody = React.forwardRef<GridTableBodyElement, GridTableBodyProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableBody.displayName = "GridTable.Body";
