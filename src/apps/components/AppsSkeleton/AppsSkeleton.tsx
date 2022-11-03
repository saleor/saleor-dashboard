import { TableCell } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import TableRowLink from "@saleor/components/TableRowLink";
import React from "react";

import { useStyles } from "../../styles";

export const AppsSkeleton = () => {
  const classes = useStyles({});

  return (
    <TableRowLink className={classes.tableRow}>
      <TableCell colSpan={2} className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRowLink>
  );
};

AppsSkeleton.displayName = "AppsSkeleton";
export default AppsSkeleton;
