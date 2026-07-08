import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface VoucherDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  voucherCode: ReactNode;
}

export const VoucherDeleteDialog = ({
  confirmButtonState,
  onClose,
  onConfirm,
  open,
  voucherCode,
}: VoucherDeleteDialogProps): JSX.Element => {
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
            <Box>
              <FormattedMessage
                description="dialog content"
                id="NEJo1I"
                defaultMessage="Are you sure you want to delete {voucherCode}?"
                values={{ voucherCode }}
              />
            </Box>
          }
        >
          <FormattedMessage
            description="dialog header"
            id="Hgz44z"
            defaultMessage="Delete Voucher"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
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

VoucherDeleteDialog.displayName = "VoucherDeleteDialog";
