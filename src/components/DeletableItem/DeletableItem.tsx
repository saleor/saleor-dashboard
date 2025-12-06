import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { IconButton } from "@saleor/macaw-ui";
import { Trash2 } from "lucide-react";

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
}

const DeletableItem = ({ onDelete, id }: DeletableItemProps) => {
  const handleDelete = () => onDelete(id);

  return (
    <IconButton variant="secondary" onClick={handleDelete}>
      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
    </IconButton>
  );
};

export default DeletableItem;
