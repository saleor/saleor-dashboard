import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableRootElement = React.ElementRef<"div">;

export const TableContext = React.createContext({ striped: false });

interface TableProps {
  striped?: boolean;
}

export const TableRoot = React.forwardRef<TableRootElement, PropsWithBox<TableProps>>(
  (props, forwardedRef) => {
    const { children, striped = true, ...rest } = props;

    return (
      <TableContext.Provider value={{ striped }}>
        <Box ref={forwardedRef} height={0} {...rest}>
          <Box
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
      </TableContext.Provider>
    );
  },
);
TableRoot.displayName = "Table.Root";
