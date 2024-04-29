import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type GridTableRootElement = React.ElementRef<"div">;

export const GridTableContext = React.createContext({ striped: false });

interface GridTableProps {
  striped?: boolean;
}

export const GridTableRoot = React.forwardRef<GridTableRootElement, PropsWithBox<GridTableProps>>(
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
