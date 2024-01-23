import { Box, Button, EditIcon, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";

interface RuleActionsProps {
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const RuleActions = ({
  disabled,
  onEdit,
  onDelete,
}: RuleActionsProps) => {
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
