import ActionDialog from "@dashboard/components/ActionDialog";
import { buttonMessages } from "@dashboard/intl";
import { DialogContentText } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import AppDeactivateDialogContent from "./AppDeactivateDialogContent";
import msgs from "./messages";

export interface AppDeactivateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  thirdParty?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AppDeactivateDialog: React.FC<AppDeactivateDialogProps> = ({
  confirmButtonState,
  open,
  name,
  thirdParty = true,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(buttonMessages.deactivate)}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.deactivateAppTitle)}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">
        <AppDeactivateDialogContent name={name} thirdParty={thirdParty} />
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeactivateDialog.displayName = "AppDeactivateDialog";
export default AppDeactivateDialog;
