import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
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
    <Button
      variant="tertiary"
      type="button"
      icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
      onClick={handleDelete}
      disabled={disabled}
    />
  );
};

export default DeletableItem;
