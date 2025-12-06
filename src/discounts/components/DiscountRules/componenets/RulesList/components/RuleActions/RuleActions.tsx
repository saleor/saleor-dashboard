import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Pencil, Trash2 } from "lucide-react";

interface RuleActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const RuleActions = ({ onEdit, onDelete }: RuleActionsProps) => {
  const { disabled } = useDiscountRulesContext();

  return (
    <Box display="flex">
      <Button
        size="small"
        variant="tertiary"
        onClick={onEdit}
        cursor={disabled ? "not-allowed" : "pointer"}
        disabled={disabled}
        data-test-id="rule-edit-button"
      >
        <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Button>
      <Button
        size="small"
        disabled={disabled}
        variant="tertiary"
        data-test-id="rule-delete-button"
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Button>
    </Box>
  );
};
