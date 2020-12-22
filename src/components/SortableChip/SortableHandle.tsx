import { makeStyles } from "@material-ui/core/styles";
import Draggable from "@saleor/icons/Draggable";
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
    <Draggable className={classNames(classes.drag, className)} {...restProps} />
  );
});

export default SortableHandle;
