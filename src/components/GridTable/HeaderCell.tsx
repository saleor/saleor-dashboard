import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { ThHTMLAttributes } from "react";

type GridTableHeaderCellElement = React.ElementRef<"th">;
type GridTableHeaderCellProps = PropsWithBox<
  Omit<ThHTMLAttributes<HTMLTableCellElement>, "color" | "height" | "width">
>;

export const GridTableHeaderCell = React.forwardRef<
  GridTableHeaderCellElement,
  GridTableHeaderCellProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <Box
      as="th"
      ref={forwardedRef}
      textAlign="left"
      padding={2}
      fontSize={2}
      fontWeight="medium"
      color="default1"
      borderTopStyle="solid"
      borderBottomStyle="solid"
      borderCollapse="collapse"
      borderColor="default1"
      borderWidth={1}
      {...props}
    >
      {children}
    </Box>
  );
});
GridTableHeaderCell.displayName = "GridTable.HeaderCell";
