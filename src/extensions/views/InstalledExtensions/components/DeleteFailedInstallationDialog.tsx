import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { messages } from "@dashboard/extensions/messages";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface DeleteFailedInstallationDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  name?: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteFailedInstallationDialog = ({
  confirmButtonState,
  onConfirm,
  open,
  name,
  onClose,
}: DeleteFailedInstallationDialogProps) => {
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
            <Box data-test-id="dialog-content">
              <FormattedMessage
                {...messages.deleteFailedInstallationContent}
                values={{
                  name: name ? <strong>{name}</strong> : "",
                }}
              />
            </Box>
          }
        >
          <FormattedMessage {...messages.deleteFailedInstallation} />
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

DeleteFailedInstallationDialog.displayName = "DeleteFailedInstallationDialog";
