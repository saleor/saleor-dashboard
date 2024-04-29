import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { ColgroupHTMLAttributes } from "react";

type GridTableColgroupElement = React.ElementRef<"colgroup">;
type GridTableColgroupProps = PropsWithBox<
  // There is no HTMLColgroupElement
  Omit<ColgroupHTMLAttributes<HTMLElement>, "color" | "height" | "width">
>;

export const GridTableColgroup = React.forwardRef<GridTableColgroupElement, GridTableColgroupProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="colgroup" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableColgroup.displayName = "GridTable.Colgroup";
