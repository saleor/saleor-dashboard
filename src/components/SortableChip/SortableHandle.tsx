import { DragIcon, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
  {
    drag: {
      cursor: "grab"
    }
  },
  { name: "SortableHandle" }
);

interface SortableHandle {
  className?: string;
}

const SortableHandle = SortableHandleHoc(props => {
  const { className, ...restProps } = props;
  const classes = useStyles(props);

  return (
    <DragIcon className={classNames(classes.drag, className)} {...restProps} />
  );
});

export default SortableHandle;
