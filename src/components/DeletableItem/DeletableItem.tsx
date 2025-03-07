import { DeleteIcon, IconButton } from "@saleor/macaw-ui";

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
}

const DeletableItem = ({ onDelete, id }: DeletableItemProps) => {
  const handleDelete = () => onDelete(id);

  return (
    <IconButton variant="secondary" onClick={handleDelete}>
      {/* @ts-expect-error wrong typing in old macaw-ui */}
      <DeleteIcon />
    </IconButton>
  );
};

export default DeletableItem;
