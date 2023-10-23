import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface VoucherCodesManualDialogProps {
  open: boolean;
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

interface FormData {
  code: string;
}

const intialData: FormData = {
  code: "",
};

export const VoucherCodesManualDialog = ({
  open,
  confirmButtonTransitionState,
  onClose,
  onSubmit,
}: VoucherCodesManualDialogProps) => {
  const intl = useIntl();

  const { data, change, submit, reset } = useForm(
    intialData,
    ({ code }: FormData) => onSubmit(code),
  );

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
          <FormattedMessage defaultMessage="Enter Voucher Code" id="giVGCH" />
        </DashboardModal.Title>
        <Box display="grid" gap={3} __width={390}>
          <Input
            name="code"
            type="text"
            size="small"
            label={intl.formatMessage(messages.enterCode)}
            value={data.code}
            onChange={change}
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <ConfirmButton
            transitionState={confirmButtonTransitionState}
            onClick={handleSubmit}
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
