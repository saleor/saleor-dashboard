import { DashboardModal } from "@dashboard/components/Modal";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface VoucherCodesManualDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const VoucherCodesManualDialog = ({
  open,
  onClose,
  onSubmit,
}: VoucherCodesManualDialogProps) => {
  const intl = useIntl();
  const { change, submit, data, reset } = useForm(
    {
      quantity: "",
      prefix: "",
    },
    onSubmit,
  );

  const handleModalClose = () => {
    onClose();
    reset();
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content>
        <DashboardModal.Title>Enter Voucher Code</DashboardModal.Title>
        <Box __width={390}>
          <Input
            name="quantity"
            type="text"
            label="Enter Code"
            value={data.quantity}
            onChange={change}
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <Button onClick={submit}>
            {intl.formatMessage(buttonMessages.confirm)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
