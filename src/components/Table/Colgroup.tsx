import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableColgroupElement = React.ElementRef<"thead">;

export const TableColgroup = React.forwardRef<TableColgroupElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="colgroup" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
TableColgroup.displayName = "Table.Colgroup";
