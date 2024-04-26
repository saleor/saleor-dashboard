import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableRowElement = React.ElementRef<"tr">;

export const TableRow = React.forwardRef<TableRowElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Box as="tr" ref={forwardedRef} backgroundColor={{ evenChild: "default2" }} {...props}>
        {children}
      </Box>
    );
  },
);
TableRow.displayName = "Table.Row";
