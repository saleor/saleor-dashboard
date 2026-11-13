import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { discountGeneralInfoMessages } from "../DiscountGeneralInfo/messages";
import { discountTypeChangeDialogMessages as messages } from "./messages";

interface DiscountTypeChangeDialogProps {
  open: boolean;
  /** The type the promotion has now, whose rules the change would remove. */
  currentType: PromotionTypeEnum;
  ruleCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Asks before changing a new promotion's type removes the rules added so far. Catalog and Order
 * rules have different conditions and rewards, so they can't move to the other type.
 */
export const DiscountTypeChangeDialog = ({
  open,
  currentType,
  ruleCount,
  onConfirm,
  onClose,
}: DiscountTypeChangeDialogProps): ReactNode => {
  const intl = useIntl();
  const typeName = intl.formatMessage(
    currentType === PromotionTypeEnum.ORDER
      ? discountGeneralInfoMessages.orderType
      : discountGeneralInfoMessages.catalogType,
  );

  return (
    <ActionDialog
      open={open}
      title={intl.formatMessage(messages.title)}
      confirmButtonLabel={intl.formatMessage(messages.confirm)}
      confirmButtonState="default"
      variant="delete"
      backButtonText={intl.formatMessage(buttonMessages.cancel)}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      {intl.formatMessage(messages.body, { count: ruleCount, type: typeName })}
    </ActionDialog>
  );
};
