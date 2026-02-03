import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

import { useSortableContext } from "./SortableTableBody";

const useStyles = makeStyles(
  theme => ({
    columnDrag: {
      "&&&": {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
      },
      cursor: "grab",
      width: 40,
    },
    disabled: {
      cursor: "default",
      opacity: 0.3,
    },
  }),
  { name: "SortableHandle" },
);

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const SortableHandle = SortableHandleHoc(() => {
  const classes = useStyles({});
  const { disabled } = useSortableContext();

  return (
    <TableCell className={clsx(classes.columnDrag, disabled && classes.disabled)}>
      <GripVertical size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
    </TableCell>
  );
});

export default SortableHandle;
