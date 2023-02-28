import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { TableCell } from "@material-ui/core";
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
