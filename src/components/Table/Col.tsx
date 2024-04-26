import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableColElement = React.ElementRef<"thead">;

export const TableCol = React.forwardRef<TableColElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="col" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
TableCol.displayName = "Table.Col";
