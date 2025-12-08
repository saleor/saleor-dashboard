import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { GripVertical } from "lucide-react";
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

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const SortableHandle = SortableHandleHoc(() => {
  const classes = useStyles({});

  return (
    <TableCell className={classes.columnDrag}>
      <GripVertical size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
    </TableCell>
  );
});

export default SortableHandle;
