import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
  disabled?: boolean;
  /** Tooltip and accessible name for the icon-only control. */
  label?: string;
}

const DeletableItem = ({
  onDelete,
  id,
  disabled = false,
  label,
}: DeletableItemProps): React.ReactNode => {
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
      title={label}
      aria-label={label}
    />
  );
};

export default DeletableItem;
