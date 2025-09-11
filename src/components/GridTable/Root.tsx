import { Box } from "@saleor/macaw-ui-next";
import { TableHTMLAttributes } from "react";
import * as React from "react";

import { GridTableProps } from "./types";

type GridTableRootElement = React.ElementRef<"div">;
type GridTableRootProps = GridTableProps<TableHTMLAttributes<HTMLTableElement>>;

export const GridTableRoot = React.forwardRef<GridTableRootElement, GridTableRootProps>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;

    return (
      // @ts-expect-error - incorrect types
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
