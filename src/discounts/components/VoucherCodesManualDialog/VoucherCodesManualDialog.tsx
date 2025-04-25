import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface VoucherCodesManualDialogProps {
  open: boolean;
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export const VoucherCodesManualDialog = ({
  open,
  confirmButtonTransitionState,
  onClose,
  onSubmit,
}: VoucherCodesManualDialogProps) => {
  const intl = useIntl();
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const handleModalClose = () => {
    onClose();
    setCode("");
    setError("");
  };
  const handleSubmit = async () => {
    try {
      await onSubmit(code);
      onClose();
      setCode("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "Code already exists") {
          setError(intl.formatMessage(messages.codeExists));
        }
      }
    }
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage defaultMessage="Enter Voucher Code" id="giVGCH" />
        </DashboardModal.Header>
        <Box display="grid" gap={3} __width={390}>
          <Input
            data-test-id="enter-code-input"
            name="code"
            type="text"
            size="small"
            label={intl.formatMessage(messages.enterCode)}
            value={code}
            error={!!error}
            helperText={error}
            onChange={e => {
              setCode(e.target.value);
              setError("");
            }}
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <ConfirmButton
            data-test-id="confirm-button"
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
