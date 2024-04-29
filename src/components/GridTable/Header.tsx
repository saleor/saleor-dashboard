import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

type GridTableHeaderElement = React.ElementRef<"thead">;
type GridTableHeaderProps = PropsWithBox<Omit<HTMLAttributes<HTMLElement>, "color">>;

export const GridTableHeader = React.forwardRef<GridTableHeaderElement, GridTableHeaderProps>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="thead" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
GridTableHeader.displayName = "GridTable.Header";
