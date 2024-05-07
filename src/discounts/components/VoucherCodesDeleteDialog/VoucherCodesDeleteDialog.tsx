import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface VoucherCodesDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const VoucherCodesDeleteDialog = ({
  open,
  onClose,
  onDelete,
}: VoucherCodesDeleteDialogProps) => {
  const intl = useIntl();
  const handleSubmit = async () => {
    onDelete();
    onClose();
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content>
        <DashboardModal.Title>
          <FormattedMessage id="WMN0q+" defaultMessage="Delete voucher codes" />
        </DashboardModal.Title>

        <Text as="p">
          <FormattedMessage
            id="GA+Djy"
            defaultMessage="Are you sure you want to delete these voucher codes?"
          />
        </Text>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>

          <Button onClick={handleSubmit}>{intl.formatMessage(buttonMessages.delete)}</Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
