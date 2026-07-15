import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { FormattedMessage } from "react-intl";

import { productVariantEndPreorderDialogMessages as messages } from "./messages";

interface ProductVariantEndPreorderDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variantGlobalSoldUnits?: number;
}

export const ProductVariantEndPreorderDialog = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm,
  variantGlobalSoldUnits,
}: ProductVariantEndPreorderDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage {...messages.dialogMessage} values={{ variantGlobalSoldUnits }} />
          }
        >
          <FormattedMessage {...messages.dialogTitle} />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            <FormattedMessage {...messages.dialogConfirmButtonLabel} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductVariantEndPreorderDialog.displayName = "ProductVariantEndPreorderDialog";
