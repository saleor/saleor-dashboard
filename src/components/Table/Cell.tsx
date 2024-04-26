import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableCellElement = React.ElementRef<"td">;

export const TableCell = React.forwardRef<TableCellElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Box
        as="td"
        ref={forwardedRef}
        height="100%"
        borderStyle="solid"
        borderColor="default1"
        padding={2}
        borderLeftStyle={{ firstChild: "none", default: "solid" }}
        borderRightStyle={{ lastChild: "none", default: "solid" }}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
TableCell.displayName = "Table.Cell";
