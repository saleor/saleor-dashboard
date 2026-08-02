import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { IconButton } from "@saleor/macaw-ui";
import { Trash2 } from "lucide-react";

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
  disabled?: boolean;
}

const DeletableItem = ({ onDelete, id, disabled = false }: DeletableItemProps) => {
  const handleDelete = () => {
    if (!disabled) {
      onDelete(id);
    }
  };

  return (
    <IconButton variant="secondary" onClick={handleDelete} disabled={disabled}>
      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
    </IconButton>
  );
};

export default DeletableItem;
