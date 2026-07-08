import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface UnassignMembersDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  quantity: number;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const UnassignMembersDialog = ({
  confirmButtonState,
  quantity,
  onClose,
  onConfirm,
  open,
}: UnassignMembersDialogProps) => {
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
              data-test-id="unassign-members-dialog-text"
              id="XGBsoK"
              defaultMessage="Are you sure you want to unassign {counter,plural,one{this member} other{{displayQuantity} members}}?"
              description="dialog content"
              values={{
                counter: quantity,
                displayQuantity: <strong>{quantity}</strong>,
              }}
            />
          }
        >
          <FormattedMessage
            id="lT5MYM"
            defaultMessage="Unassign users"
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

UnassignMembersDialog.displayName = "UnassignMembersDialog";
