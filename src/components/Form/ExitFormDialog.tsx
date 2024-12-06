import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { exitFormPromptMessages as messages } from "./messages";

interface ExitFormDialogProps {
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
}

const ExitFormDialog = ({ onLeave, onClose, isOpen }: ExitFormDialogProps) => {
  const intl = useIntl();

  return (
    <DashboardModal open={isOpen} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          {intl.formatMessage(messages.unableToSaveTitle)}
        </DashboardModal.Header>

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
