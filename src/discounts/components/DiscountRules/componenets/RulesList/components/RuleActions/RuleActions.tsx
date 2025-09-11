import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Box, Button, EditIcon, TrashBinIcon } from "@saleor/macaw-ui-next";

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
        <EditIcon />
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
        <TrashBinIcon />
      </Button>
    </Box>
  );
};
