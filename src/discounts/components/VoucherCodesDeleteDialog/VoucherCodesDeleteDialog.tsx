import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface VoucherCodesDeleteDialogProps {
  open: boolean;
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const VoucherCodesDeleteDialog = ({
  open,
  confirmButtonTransitionState,
  onClose,
  onDelete,
}: VoucherCodesDeleteDialogProps) => {
  const intl = useIntl();
  const isDeleting = confirmButtonTransitionState === "loading";
  const handleSubmit = async () => {
    await onDelete();
    onClose();
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage id="WMN0q+" defaultMessage="Delete voucher codes" />
        </DashboardModal.Header>

        <Text as="p">
          <FormattedMessage
            id="GA+Djy"
            defaultMessage="Are you sure you want to delete these voucher codes?"
          />
        </Text>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary" disabled={isDeleting}>
            {intl.formatMessage(buttonMessages.back)}
          </Button>

          <ConfirmButton
            transitionState={confirmButtonTransitionState}
            onClick={handleSubmit}
            variant="error"
            data-test-id="submit"
          >
            {intl.formatMessage(buttonMessages.delete)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
