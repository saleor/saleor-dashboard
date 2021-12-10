import { TableCell, TableRow } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";

import { useStyles } from "../../styles";

export const AppsSkeleton = () => {
  const classes = useStyles({});

  return (
    <TableRow className={classes.tableRow}>
      <TableCell colSpan={2} className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
};

AppsSkeleton.displayName = "AppsSkeleton";
export default AppsSkeleton;
