import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

import { TableContext } from "./Root";

type TableRowElement = React.ElementRef<"tr">;

export const TableRow = React.forwardRef<TableRowElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    const ctx = React.useContext(TableContext);

    if (!ctx) {
      throw new Error("TableRow must be used within a TableRoot");
    }

    const backgroundColor = ctx.striped ? { evenChild: "default2" as const } : undefined;

    return (
      <Box as="tr" ref={forwardedRef} backgroundColor={backgroundColor} {...props}>
        {children}
      </Box>
    );
  },
);
TableRow.displayName = "Table.Row";
