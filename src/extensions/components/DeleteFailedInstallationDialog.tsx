import msgs from "@dashboard/apps/components/AppInProgressDeleteDialog/messages";
import ActionDialog from "@dashboard/components/ActionDialog";
import { messages } from "@dashboard/extensions/messages";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui/dist/types/ConfirmButton";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteFailedInstallationDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  name?: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteFailedInstallationDialog = ({
  confirmButtonState,
  onConfirm,
  open,
  name,
  onClose,
}: DeleteFailedInstallationDialogProps) => {
  const intl = useIntl();
  const isNameMissing = name === null || name === "";
  const getMainText = () => {
    if (isNameMissing) {
      return intl.formatMessage(msgs.deleteApp);
    }

    return intl.formatMessage(msgs.deleteNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(messages.deleteAppHeader)}
      variant="delete"
    >
      <Box data-test-id="dialog-content">{getMainText()}</Box>
    </ActionDialog>
  );
};
