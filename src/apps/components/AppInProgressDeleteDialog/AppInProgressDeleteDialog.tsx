import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { DialogContentText } from "@material-ui/core";
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

const AppInProgressDeleteDialog = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}: AppInProgressDeleteDialogProps) => {
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
      title={intl.formatMessage(msgs.header)}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">{getMainText()}</DialogContentText>
    </ActionDialog>
  );
};
AppInProgressDeleteDialog.displayName = "AppInProgressDeleteDialog";
export default AppInProgressDeleteDialog;
