import { Typography } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { PermissionGroupErrorFragment } from "@saleor/fragments/types/PermissionGroupErrorFragment";
import { PermissionGroupErrorCode } from "@saleor/types/globalTypes";
import getPermissionGroupErrorMessage from "@saleor/utils/errors/permissionGroups";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PermissionDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  error?: PermissionGroupErrorFragment;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

const PermissionGroupDeleteDialog: React.FC<PermissionDeleteDialogProps> = ({
  confirmButtonState,
  error,
  name,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();

  let errorMessage;
  if (error?.code === PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION) {
    errorMessage = intl.formatMessage({
      defaultMessage:
        "Cant's delete group which is out of your permission scope",
      description: "deletion error message"
    });
  } else if (!!error) {
    errorMessage = getPermissionGroupErrorMessage(error, intl);
  }

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
      {!!errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </ActionDialog>
  );
};
PermissionGroupDeleteDialog.displayName = "PermissionGroupDeleteDialog";
export default PermissionGroupDeleteDialog;
