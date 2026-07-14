import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface AttributeBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  quantity: number;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AttributeBulkDeleteDialog = ({
  confirmButtonState,
  quantity,
  onClose,
  onConfirm,
  open,
}: AttributeBulkDeleteDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs" data-test-id="attribute-bulk-delete-dialog">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="lG/MDw"
              defaultMessage="{counter,plural,one{Are you sure you want to delete this attribute?} other{Are you sure you want to delete {displayQuantity} attributes?}}"
              data-test-id="delete-attr-from-list-dialog-text"
              description="dialog content"
              values={{
                counter: quantity,
                displayQuantity: <strong>{quantity}</strong>,
              }}
            />
          }
        >
          <FormattedMessage
            id="rKf4LU"
            defaultMessage="Delete attributes"
            description="dialog title"
          />
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

AttributeBulkDeleteDialog.displayName = "AttributeBulkDeleteDialog";
