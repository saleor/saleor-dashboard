import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";
import { GripVertical } from "lucide-react";

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

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const SortableHandle = SortableHandleHoc(() => {
  const classes = useStyles({});

  return (
    <TableCell className={classes.columnDrag}>
      <GripVertical />
    </TableCell>
  );
});

export default SortableHandle;
