import TableRowLink from "@dashboard/components/TableRowLink";
import { TableCell } from "@material-ui/core";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

import { useStyles } from "./styles";

export const CustomAppsSkeleton = () => {
  const classes = useStyles();

  return (
    <TableRowLink className={classes.tableRow}>
      <TableCell colSpan={2} className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRowLink>
  );
};

CustomAppsSkeleton.displayName = "CustomAppsSkeleton";
export default CustomAppsSkeleton;
