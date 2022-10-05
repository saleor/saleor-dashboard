import { DragIcon, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
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

  return (
    <DragIcon
      className={classNames(classes.drag, className)}
      tabIndex={0}
      {...restProps}
    />
  );
});

export default SortableHandle;
