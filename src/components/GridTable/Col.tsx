import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { ColHTMLAttributes } from "react";

type GridTableColElement = React.ElementRef<"col">;
type GridTableColProps = PropsWithBox<
  Omit<ColHTMLAttributes<HTMLTableColElement>, "color" | "height" | "width">
>;

export const GridTableCol = React.forwardRef<GridTableColElement, GridTableColProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableCol.displayName = "GridTable.Col";
