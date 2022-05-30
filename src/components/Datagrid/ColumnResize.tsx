import React from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

import useStyles from "./styles";

const ColumnResize: React.FC<{
  offset: number;
  onDrop: DraggableEventHandler;
}> = ({ offset, onDrop }) => {
  const classes = useStyles();
  const [drag, setDrag] = React.useState(false);

  return (
    <Draggable
      axis="x"
      onMouseDown={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrag={() => {
        setDrag(true);
      }}
      onStop={(event, data) => {
        setDrag(false);
        onDrop(event, data);
      }}
    >
      <div
        className={classes.columnResize}
        style={{
          background: drag ? "red" : "transparent",

          left: offset
        }}
      />
    </Draggable>
  );
};

export default ColumnResize;
