import { DeleteIcon, IconButton, IconButtonProps } from "@saleor/macaw-ui";

const DeleteIconButton = ({ onClick }: IconButtonProps) => (
  <IconButton variant="secondary" onClick={onClick} data-test-id="button-delete-items">
    {/* @ts-expect-error wrong typing in old macaw-ui */}
    <DeleteIcon />
  </IconButton>
);

export default DeleteIconButton;
