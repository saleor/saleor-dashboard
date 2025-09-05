import { DeleteIcon, IconButton, IconButtonProps } from "@saleor/macaw-ui";

const DeleteIconButton = ({ onClick }: IconButtonProps) => (
  <IconButton variant="secondary" onClick={onClick} data-test-id="button-delete-items">
    <DeleteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
  </IconButton>
);

export default DeleteIconButton;
