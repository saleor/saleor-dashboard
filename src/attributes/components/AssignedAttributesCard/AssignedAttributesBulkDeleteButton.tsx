import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";

interface AssignedAttributesBulkDeleteButtonProps {
  onClick: () => void;
  label: string;
}

/** Icon-only bulk unassign — same size as the row trash so the actions column does not shift. */
export const AssignedAttributesBulkDeleteButton = ({
  onClick,
  label,
}: AssignedAttributesBulkDeleteButtonProps): JSX.Element => (
  <Button
    data-test-id="bulk-delete-button"
    variant="tertiary"
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
  />
);
