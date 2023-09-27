import { DashboardModal } from "@dashboard/components/Modal";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface VoucherCodesGenerateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateMultipleVoucherCodeFormData) => void;
}

export interface GenerateMultipleVoucherCodeFormData {
  quantity: string;
  prefix: string;
}

const initialData: GenerateMultipleVoucherCodeFormData = {
  quantity: "",
  prefix: "",
};

export const VoucherCodesGenerateDialog = ({
  open,
  onClose,
  onSubmit,
}: VoucherCodesGenerateDialogProps) => {
  const intl = useIntl();
  const { change, submit, data, reset } = useForm(initialData, onSubmit);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      /\D/.test(e.key) &&
      ![
        "Backspace",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleModalClose = () => {
    onClose();
    reset();
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content>
        <DashboardModal.Title>Generate voucher codes</DashboardModal.Title>
        <Box display="grid" gap={3} __width={390}>
          <Input
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label="Code quantity"
            onKeyDown={handleKeyDown}
            value={data.quantity}
            onChange={change}
          />
          <Input
            name="prefix"
            label="Code Prefix (Optional)"
            value={data.prefix}
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
