import { Box } from "@saleor/macaw-ui-next";
import React, { TableHTMLAttributes } from "react";

import { GridTableProps } from "./types";

type GridTableRootElement = React.ElementRef<"div">;
type GridTableRootProps = GridTableProps<TableHTMLAttributes<HTMLTableElement>>;

export const GridTableRoot = React.forwardRef<GridTableRootElement, GridTableRootProps>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;

    return (
      <Box height={0} {...rest}>
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
        >
          {children}
        </Box>
      </Box>
    );
  },
);
GridTableRoot.displayName = "GridTable.Root";
