import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableHeaderElement = React.ElementRef<"thead">;

export const TableHeader = React.forwardRef<TableHeaderElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => (
    <Box as="thead" ref={forwardedRef} {...props}>
      {children}
    </Box>
  ),
);
TableHeader.displayName = "Table.Header";
