import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

type TableRootElement = React.ElementRef<"div">;

export const TableRoot = React.forwardRef<TableRootElement, PropsWithBox<unknown>>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;

    return (
      <Box ref={forwardedRef} height={0} {...rest}>
        <Box
          as="table"
          width="100%"
          borderColor="default1"
          borderTopStyle="solid"
          borderBottomStyle="solid"
          borderCollapse="collapse"
        >
          {children}
        </Box>
      </Box>
    );
  },
);
TableRoot.displayName = "Table.Root";
