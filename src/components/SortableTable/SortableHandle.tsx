import makeStyles from "@material-ui/core/styles/makeStyles";
import TableCell from "@material-ui/core/TableCell";
import React from "react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

import Draggable from "@saleor/icons/Draggable";

const useStyles = makeStyles(
  theme => ({
    columnDrag: {
      "&:first-child": {
        paddingRight: theme.spacing(2)
      },
      cursor: "grab",
      width: 48 + theme.spacing(1.5)
    }
  }),
  { name: "SortableHandle" }
);

const SortableHandle = SortableHandleHoc(() => {
  const classes = useStyles({});

  return (
    <TableCell className={classes.columnDrag}>
      <Draggable />
    </TableCell>
  );
});

export default SortableHandle;
