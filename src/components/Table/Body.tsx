import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableBodyElement = React.ElementRef<"tbody">;

export const TableBody = React.forwardRef<TableBodyElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="tbody" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
TableBody.displayName = "Table.Body";
