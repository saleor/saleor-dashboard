import { Box } from "@saleor/macaw-ui-next";
import { ComponentProps, ReactNode } from "react";

import { TablePaginationWithContext } from "./TablePaginationWithContext";

type DatagridPaginationProps =
  | { children: ReactNode }
  | ComponentProps<typeof TablePaginationWithContext>;

/** Pagination wrapper with consistent padding for Datagrid layouts */
export const DatagridPagination = (props: DatagridPaginationProps) => {
  const content = "children" in props ? props.children : <TablePaginationWithContext {...props} />;

  return (
    <Box paddingX={6} __paddingTop="15px" paddingBottom={4}>
      {content}
    </Box>
  );
};
