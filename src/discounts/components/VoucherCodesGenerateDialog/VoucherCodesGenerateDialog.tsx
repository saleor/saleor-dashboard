import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui-next";
import React, { ChangeEvent, useState } from "react";
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

export const VoucherCodesGenerateDialog = ({
  open,
  onClose,
  onSubmit,
}: VoucherCodesGenerateDialogProps) => {
  const intl = useIntl();
  const [data, setData] = useState<GenerateMultipleVoucherCodeFormData>(initialData);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (Number.isNaN(Number(value)) || Number(value) > MAX_VOUCHER_CODES || value.includes(".")) {
      e.preventDefault();

      return;
    }

    setData(data => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };
  const handleModalClose = () => {
    onClose();
    setData(initialData);
  };
  const handleSubmit = async () => {
    await onSubmit(data);
    onClose();
    setData(initialData);
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header onClose={onClose}>
          {intl.formatMessage(messages.title)}
        </DashboardModal.Header>
        <Box display="grid" gap={3} __width={390}>
          <Input
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label={intl.formatMessage(messages.codeQuantity, {
              maxCodes: MAX_VOUCHER_CODES,
            })}
            value={data.quantity}
            onChange={handleChange}
            data-test-id="quantity-input"
          />
          <Input
            name="prefix"
            label={intl.formatMessage(messages.codePrefix)}
            value={data.prefix}
            onChange={e => {
              setData(data => ({
                ...data,
                [e.target.name]: e.target.value,
              }));
            }}
            data-test-id="prefix-input"
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={Number(data.quantity) === 0}
            data-test-id="confirm-button"
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
