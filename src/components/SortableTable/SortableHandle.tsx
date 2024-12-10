import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { GripIcon } from "@saleor/macaw-ui-next";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
  theme => ({
    columnDrag: {
      "&&&": {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(2),
      },
      cursor: "grab",
      width: `calc(48px + ${theme.spacing(1.5)})`,
    },
  }),
  { name: "SortableHandle" },
);
const SortableHandle = SortableHandleHoc(() => {
  const classes = useStyles({});

  return (
    <TableCell className={classes.columnDrag}>
      <GripIcon />
    </TableCell>
  );
});

export default SortableHandle;
