import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export interface PermissionDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}

const PermissionGroupDeleteDialog: React.FC<PermissionDeleteDialogProps> = ({
  confirmButtonState,
  name,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Delete permission group",
        description: "dialog title"
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to delete {name}?"
          description="dialog content"
          values={{
            name: <strong>{name}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
PermissionGroupDeleteDialog.displayName = "PermissionGroupDeleteDialog";
export default PermissionGroupDeleteDialog;
