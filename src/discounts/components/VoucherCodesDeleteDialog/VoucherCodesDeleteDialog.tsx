import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface VoucherCodesDeleteDialogProps {
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onClose: () => void;
  onDelete: () => Promise<boolean>;
  open: boolean;
}

export const VoucherCodesDeleteDialog = ({
  confirmButtonTransitionState,
  onClose,
  onDelete,
  open,
}: VoucherCodesDeleteDialogProps) => {
  const isDeleting = confirmButtonTransitionState === "loading";

  const handleClose = (): void => {
    if (isDeleting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (): Promise<void> => {
    const shouldClose = await onDelete();

    if (shouldClose) {
      onClose();
    }
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              defaultMessage="Are you sure you want to delete these voucher codes?"
              id="GA+Djy"
            />
          }
        >
          <FormattedMessage defaultMessage="Delete voucher codes" id="WMN0q+" />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isDeleting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isDeleting}
            onClick={handleSubmit}
            transitionState={confirmButtonTransitionState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

VoucherCodesDeleteDialog.displayName = "VoucherCodesDeleteDialog";
