import ActionDialog from "@dashboard/components/ActionDialog";
import { buttonMessages } from "@dashboard/intl";
import { DialogContentText } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import AppActivateDialogText from "./AppActivateDialogContent";
import msgs from "./messages";

export interface AppActivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const AppActivateDialog: React.FC<AppActivateDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

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
      <DialogContentText data-test-id="dialog-content">
        <AppActivateDialogText name={name} />
      </DialogContentText>
    </ActionDialog>
  );
};
AppActivateDialog.displayName = "AppActivateDialog";
export default AppActivateDialog;
