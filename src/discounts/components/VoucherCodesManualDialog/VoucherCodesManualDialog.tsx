import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
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
  const codeInputRef = useRef<HTMLInputElement>(null);
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

  // Opened from the Add-code popover — native autoFocus loses to popover focus restore
  // and Dialog chrome. Same delayed focus as ProductExternalMediaDialog.
  useEffect(
    function focusCodeInputWhenDialogOpens() {
      if (!open) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        codeInputRef.current?.focus();
      }, 50);

      return () => window.clearTimeout(timeoutId);
    },
    [open],
  );

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content disableAutofocus size="xs">
        <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="grid" gap={3}>
              <Input
                ref={codeInputRef}
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
