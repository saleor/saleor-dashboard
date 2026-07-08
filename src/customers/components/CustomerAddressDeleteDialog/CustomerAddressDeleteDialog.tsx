import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface CustomerAddressDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CustomerAddressDeleteDialog = ({
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: CustomerAddressDeleteDialogProps) => {
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
            <Box data-test-id="delete-address-dialog-content">
              <FormattedMessage
                id="/kWzY1"
                defaultMessage="Are you sure you want to delete this address from users address book?"
              />
            </Box>
          }
        >
          <FormattedMessage
            description="dialog header"
            id="qLOBff"
            defaultMessage="Delete Address"
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

CustomerAddressDeleteDialog.displayName = "CustomerAddressDeleteDialog";
