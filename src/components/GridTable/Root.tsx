import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { TableHTMLAttributes } from "react";

import { GridTableContext } from "./useGridTableContext";

export interface GridTableOwnProps {
  striped?: boolean;
}
type GridTableRootElement = React.ElementRef<"div">;
type GridTableRootProps = PropsWithBox<
  Omit<TableHTMLAttributes<HTMLTableElement>, "color" | "height" | "width">
> &
  GridTableOwnProps;

export const GridTableRoot = React.forwardRef<GridTableRootElement, GridTableRootProps>(
  (props, forwardedRef) => {
    const { children, striped = true, ...rest } = props;

    return (
      <GridTableContext.Provider value={{ striped }}>
        <Box height={0} {...rest}>
          <Box
            ref={forwardedRef}
            as="table"
            width="100%"
            borderColor="default1"
            borderTopStyle="solid"
            borderBottomStyle="solid"
            borderCollapse="collapse"
            borderWidth={1}
          >
            {children}
          </Box>
        </Box>
      </GridTableContext.Provider>
    );
  },
);
GridTableRoot.displayName = "GridTable.Root";
