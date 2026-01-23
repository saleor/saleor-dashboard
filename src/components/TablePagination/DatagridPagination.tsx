import { Box } from "@saleor/macaw-ui-next";
import { ComponentProps, ReactNode } from "react";

import { TablePaginationWithContext } from "./TablePaginationWithContext";

type DatagridPaginationProps =
  | ({ children: ReactNode } & {
      [K in keyof ComponentProps<typeof TablePaginationWithContext>]?: never;
    })
  | (ComponentProps<typeof TablePaginationWithContext> & { children?: never });

/**
 * Pagination wrapper specifically designed for use with Datagrid components.
 * Provides consistent padding for Datagrid layouts.
 *
 * Can be used in two ways:
 * 1. Pass TablePaginationWithContext props directly (uses context-based pagination)
 * 2. Pass children (wraps any pagination component with proper padding)
 */
export const DatagridPagination = (props: DatagridPaginationProps) => {
  if ("children" in props && props.children) {
    return (
      <Box paddingX={6} __paddingTop="15px" paddingBottom={4}>
        {props.children}
      </Box>
    );
  }

  // At this point, props has no children, so we can safely cast
  const paginationProps = props as ComponentProps<typeof TablePaginationWithContext>;

  return (
    <Box paddingX={6} __paddingTop="15px" paddingBottom={4}>
      <TablePaginationWithContext {...paginationProps} />
    </Box>
  );
};
