import { Box } from "@saleor/macaw-ui-next";
import { ElementRef, forwardRef, TableHTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableRootElement = ElementRef<"div">;
type GridTableRootProps = GridTableProps<TableHTMLAttributes<HTMLTableElement>>;

export const GridTableRoot = forwardRef<GridTableRootElement, GridTableRootProps>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;

    return (
      // @ts-expect-error Types of property contentEditable are incompatible.
      <Box
        ref={forwardedRef}
        as="table"
        width="100%"
        borderTopStyle="solid"
        borderBottomStyle="solid"
        borderCollapse="collapse"
        borderColor="default1"
        borderWidth={1}
        style={{
          borderSpacing: 0,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);
GridTableRoot.displayName = "GridTable.Root";
