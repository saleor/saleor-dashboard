import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Button } from "@saleor/macaw-ui-next";
import { type ReactNode, useRef } from "react";
import { useIntl } from "react-intl";

import { exitFormPromptMessages as messages } from "./messages";

interface ExitFormDialogProps {
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
  /** Confirmation copy under the title — rendered via Header subtitle (confirm-dialog pattern). */
  description?: ReactNode;
}

/** @deprecated Use react-hook-form instead */
const ExitFormDialog = ({
  onLeave,
  onClose,
  isOpen,
  description,
}: ExitFormDialogProps): JSX.Element => {
  const intl = useIntl();
  // Ignore-changes calls onLeave, which sets `open` false. Modal onChange(false) must not
  // also run onClose ("keep editing") — that clears the pending navigation target.
  const isLeavingRef = useRef(false);

  return (
    <DashboardModal
      open={isOpen}
      onChange={open => {
        if (!open) {
          if (isLeavingRef.current) {
            isLeavingRef.current = false;

            return;
          }

          onClose();
        }
      }}
    >
      <DashboardModal.Content size="sm">
        <DashboardModal.Header
          subtitle={
            description ? (
              <span data-test-id="exit-form-dialog-description">{description}</span>
            ) : undefined
          }
        >
          {intl.formatMessage(messages.unableToSaveTitle)}
        </DashboardModal.Header>
        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{intl.formatMessage(messages.keepEditing)}</BackButton>
          <Button
            variant="primary"
            onClick={() => {
              isLeavingRef.current = true;
              onLeave();
            }}
            data-test-id="ignore-changes"
          >
            {intl.formatMessage(messages.ignoreChanges)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default ExitFormDialog;
