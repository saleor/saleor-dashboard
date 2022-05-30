import React from "react";

const Column: React.FC<React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>> = ({ onDrop, ...rest }) => {
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <th
      onDragStart={e => {
        e.dataTransfer.setData("text/plain", rest["data-column"]);
      }}
      onDragEnter={() => {
        setDragOver(true);
      }}
      onDragLeave={() => {
        setDragOver(false);
      }}
      onDrop={e => {
        e.preventDefault();
        if (onDrop) {
          onDrop(e);
        }
        setDragOver(false);
      }}
      onDragOver={e => {
        e.preventDefault();
      }}
      style={dragOver ? { borderRight: `1px solid red` } : {}}
      {...rest}
    />
  );
};

export default Column;
