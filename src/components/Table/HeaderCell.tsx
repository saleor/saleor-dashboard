import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableHeaderCellElement = React.ElementRef<"th">;

export const TableHeaderCell = React.forwardRef<TableHeaderCellElement, PropsWithBox<unknown>>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Box
        as="th"
        ref={forwardedRef}
        borderStyle="solid"
        borderColor="default1"
        textAlign="left"
        padding={2}
        fontSize={2}
        fontWeight="medium"
        color="default1"
        borderLeftStyle={{ firstChild: "none", default: "solid" }}
        borderRightStyle={{ lastChild: "none", default: "solid" }}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
TableHeaderCell.displayName = "Table.HeaderCell";
