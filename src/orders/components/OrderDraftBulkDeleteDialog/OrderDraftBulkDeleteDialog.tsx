import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

import { orderDraftBulkDeleteDialogMessages as messages } from "./messages";

interface OrderDraftBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const OrderDraftBulkDeleteDialog = ({
  confirmButtonState,
  count,
  open,
  onClose,
  onConfirm,
}: OrderDraftBulkDeleteDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...messages.subtitle}
              values={{
                counter: count,
                displayQuantity: <strong>{count}</strong>,
              }}
            />
          }
        >
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderDraftBulkDeleteDialog.displayName = "OrderDraftBulkDeleteDialog";
