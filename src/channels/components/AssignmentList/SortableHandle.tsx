import { DragIcon, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
  {
    drag: {
      cursor: "grab",
    },
  },
  { name: "SortableHandle" },
);

interface SortableHandleProps {
  className?: string;
}

const SortableHandle = SortableHandleHoc((props: SortableHandleProps) => {
  const { className, ...restProps } = props;
  const classes = useStyles(props);

  return <DragIcon className={clsx(classes.drag, className)} tabIndex={0} {...restProps} />;
});

export default SortableHandle;
