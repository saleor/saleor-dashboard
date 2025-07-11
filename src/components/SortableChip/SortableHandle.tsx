import Drag from "@dashboard/icons/Drag";
import React from "react";

interface SortableHandleProps {
  className?: string;
  [key: string]: any; // For dnd-kit attributes and listeners
}

const SortableHandle: React.FC<SortableHandleProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <Drag 
      className={className} 
      tabIndex={0} 
      style={{ cursor: "grab" }}
      {...restProps} 
    />
  );
};

export default SortableHandle;
