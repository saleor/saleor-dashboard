import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
}

const DeletableItem = ({ onDelete, id }: DeletableItemProps) => {
  const handleDelete = () => onDelete(id);

  return (
    <IconButton variant="secondary" onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeletableItem;
