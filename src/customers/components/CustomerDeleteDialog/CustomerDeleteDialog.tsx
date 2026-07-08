import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface CustomerDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  email: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CustomerDeleteDialog = ({
  confirmButtonState,
  email,
  onClose,
  onConfirm,
  open,
}: CustomerDeleteDialogProps) => {
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
              description="delete customer, dialog content"
              id="2p0tZx"
              defaultMessage="Are you sure you want to delete {email}?"
              values={{ email }}
            />
          }
        >
          <FormattedMessage
            description="dialog header"
            id="ey0lZj"
            defaultMessage="Delete Customer"
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

CustomerDeleteDialog.displayName = "CustomerDeleteDialog";
