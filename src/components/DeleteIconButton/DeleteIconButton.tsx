import { DeleteIcon, IconButton, IconButtonProps } from "@saleor/macaw-ui";
import React from "react";

const DeleteIconButton: React.FC<IconButtonProps> = ({ onClick }) => (
  <IconButton variant="secondary" onClick={onClick} data-test-id="button-delete-items">
    <DeleteIcon />
  </IconButton>
);

export default DeleteIconButton;
