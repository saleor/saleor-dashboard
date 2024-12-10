import { Box } from "@saleor/macaw-ui-next";
import { TdHTMLAttributes } from "react";
import * as React from "react";

import { GridTableProps } from "./types";

type GridTableCellElement = React.ElementRef<"td">;
type GridTableCellProps = GridTableProps<TdHTMLAttributes<HTMLTableCellElement>>;

export const GridTableCell = React.forwardRef<GridTableCellElement, GridTableCellProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Box
        as="td"
        ref={forwardedRef}
        height="100%"
        padding={2}
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
  },
);
GridTableCell.displayName = "GridTable.Cell";
