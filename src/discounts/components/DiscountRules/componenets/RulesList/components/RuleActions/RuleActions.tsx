import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { Pencil, Trash2 } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./RuleActions.module.css";

interface RuleActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const RuleActions = ({ onEdit, onDelete }: RuleActionsProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();

  return (
    <Box display="flex" gap={1}>
      <button
        type="button"
        className={styles.action}
        onClick={onEdit}
        disabled={disabled}
        aria-label={intl.formatMessage(buttonMessages.edit)}
        data-test-id="rule-edit-button"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className={styles.action}
        disabled={disabled}
        aria-label={intl.formatMessage(buttonMessages.delete)}
        data-test-id="rule-delete-button"
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={16} />
      </button>
    </Box>
  );
};
