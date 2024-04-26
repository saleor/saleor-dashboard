import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableHeaderCellElement = React.ElementRef<"th">;

export const GridTableHeaderCell = React.forwardRef<
  GridTableHeaderCellElement,
  PropsWithBox<unknown>
>(({ children, ...props }, forwardedRef) => {
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
});
GridTableHeaderCell.displayName = "GridTable.HeaderCell";
