import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import msgs from "./messages";

export interface AppInProgressDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const AppInProgressDeleteDialog: React.FC<AppInProgressDeleteDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  const missingName = name === null || name === "";

  const getMainText = () => {
    if (missingName) {
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
      title={intl.formatMessage(msgs.header)}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">
        {getMainText()}
      </DialogContentText>
    </ActionDialog>
  );
};
AppInProgressDeleteDialog.displayName = "AppInProgressDeleteDialog";
export default AppInProgressDeleteDialog;
