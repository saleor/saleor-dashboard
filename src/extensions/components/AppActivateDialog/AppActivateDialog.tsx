import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import msgs from "./messages";

export interface AppActivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const AppActivateDialog = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}: AppActivateDialogProps) => {
  const intl = useIntl();
  const isNameMissing = name === null || name === "";
  const getMainText = () => {
    if (isNameMissing) {
      return intl.formatMessage(msgs.activateApp);
    }

    return intl.formatMessage(msgs.activateNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(buttonMessages.activate)}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.activateAppTitle)}
      variant="default"
    >
      <Box data-test-id="dialog-content">{getMainText()}</Box>
    </ActionDialog>
  );
};

AppActivateDialog.displayName = "AppActivateDialog";
export default AppActivateDialog;
