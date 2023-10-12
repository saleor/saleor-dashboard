import { DashboardModal } from "@dashboard/components/Modal";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui/next";
import React, { ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

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

const MAX_VOUCHER_CODES = 50;
const numberRegexp = /\d+/;

export const VoucherCodesGenerateDialog = ({
  open,
  onClose,
  onSubmit,
}: VoucherCodesGenerateDialogProps) => {
  const intl = useIntl();
  const { change, submit, data, reset } = useForm(initialData, onSubmit);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (!numberRegexp.test(value) && value !== "") {
      e.preventDefault();
      return;
    }

    if (Number(value) > MAX_VOUCHER_CODES) {
      e.preventDefault();
      return;
    }

    change(e);
  };

  const handleModalClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = async () => {
    await submit();
    onClose();
    reset();
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content>
        <DashboardModal.Title>
          {intl.formatMessage(messages.title)}
        </DashboardModal.Title>
        <Box display="grid" gap={3} __width={390}>
          <Input
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label={intl.formatMessage(messages.codeQuantity, {
              maxCodes: MAX_VOUCHER_CODES,
            })}
            // onKeyDown={handleKeyDown}
            value={data.quantity}
            onChange={handleChange}
          />
          <Input
            name="prefix"
            label={intl.formatMessage(messages.codePrefix)}
            value={data.prefix}
            onChange={change}
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <Button onClick={handleSubmit}>
            {intl.formatMessage(buttonMessages.confirm)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
