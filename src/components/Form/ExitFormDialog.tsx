import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { exitFormPromptMessages as messages } from "./messages";

interface ExitFormDialogProps {
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
}

const ExitFormDialog: React.FC<ExitFormDialogProps> = ({ onLeave, onClose, isOpen }) => {
  const intl = useIntl();

  return (
    <DashboardModal open={isOpen} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Title display="flex" justifyContent="space-between">
          {intl.formatMessage(messages.unableToSaveTitle)}
          <DashboardModal.Close onClose={onClose} />
        </DashboardModal.Title>

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{intl.formatMessage(messages.keepEditing)}</BackButton>
          <Button variant="primary" onClick={onLeave} data-test-id="ignore-changes">
            {intl.formatMessage(messages.ignoreChanges)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default ExitFormDialog;
