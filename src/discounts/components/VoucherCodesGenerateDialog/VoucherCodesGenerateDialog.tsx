import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Input } from "@saleor/macaw-ui-next";
import { type ChangeEvent, useState } from "react";
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

    setData(currentData => ({
      ...currentData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleModalClose = () => {
    setData(initialData);
    onClose();
  };
  const handleSubmit = () => {
    onSubmit(data);
    setData(initialData);
    onClose();
  };
  const isConfirmDisabled = Number(data.quantity) === 0;

  useModalDialogOpen(open, {
    onOpen: () => {
      setData(initialData);
    },
  });

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="grid" gap={3}>
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
                  setData(currentData => ({
                    ...currentData,
                    [e.target.name]: e.target.value,
                  }));
                }}
                data-test-id="prefix-input"
              />
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleModalClose} />
          <ConfirmButton
            transitionState="default"
            disabled={isConfirmDisabled}
            onClick={handleSubmit}
            data-test-id="confirm-button"
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
