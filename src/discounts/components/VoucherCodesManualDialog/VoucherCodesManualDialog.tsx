import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

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
  const resetForm = () => {
    setCode("");
    setError("");
  };
  const handleModalClose = () => {
    resetForm();
    onClose();
  };
  const handleSubmit = async () => {
    try {
      await onSubmit(code);
      resetForm();
      onClose();
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "Code already exists") {
          setError(intl.formatMessage(messages.codeExists));
        }
      }
    }
  };

  useModalDialogOpen(open, {
    onOpen: resetForm,
  });

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="grid" gap={3}>
              <Input
                data-test-id="enter-code-input"
                name="code"
                type="text"
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
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleModalClose} />
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
