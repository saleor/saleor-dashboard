import ActionDialog from "@dashboard/components/ActionDialog";
import { DialogContentText } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import AppDeleteDialogContent from "./AppDeleteDialogContent";
import msgs from "./messages";

export interface AppDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
  type: "CUSTOM" | "EXTERNAL";
}

const AppDeleteDialog: React.FC<AppDeleteDialogProps> = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
  type,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.deleteAppTitle)}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">
        <AppDeleteDialogContent name={name} type={type} />
      </DialogContentText>
    </ActionDialog>
  );
};
AppDeleteDialog.displayName = "AppDeleteDialog";
export default AppDeleteDialog;
