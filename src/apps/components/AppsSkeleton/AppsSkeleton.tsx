import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";

import { useStyles } from "../../styles";

export const AppsSkeleton = () => {
  const classes = useStyles({});

  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
};

AppsSkeleton.displayName = "AppsSkeleton";
export default AppsSkeleton;
