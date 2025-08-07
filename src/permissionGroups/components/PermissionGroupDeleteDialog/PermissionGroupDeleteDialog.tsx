import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { PermissionGroupErrorCode, PermissionGroupErrorFragment } from "@dashboard/graphql";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { Box, Text } from "@saleor/macaw-ui-next";
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

const PermissionGroupDeleteDialog = ({
  confirmButtonState,
  error,
  name,
  onClose,
  onConfirm,
  open,
}: PermissionDeleteDialogProps) => {
  const intl = useIntl();

  let errorMessage;

  if (error?.code === PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION) {
    errorMessage = intl.formatMessage({
      id: "O22NIZ",
      defaultMessage: "Cant's delete group which is out of your permission scope",
      description: "deletion error message",
    });
  } else if (error) {
    errorMessage = getPermissionGroupErrorMessage(error, intl);
  }

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        id: "L6+p8a",
        defaultMessage: "Delete permission group",
        description: "dialog title",
      })}
      variant="delete"
    >
      <Box data-testid="permission-group-delete-dialog-text">
        <FormattedMessage
          id="sR0urA"
          defaultMessage="Are you sure you want to delete {name}?"
          description="dialog content"
          values={{
            name: <strong>{name}</strong>,
          }}
        />
      </Box>
      {!!errorMessage && <Text color="critical1">{errorMessage}</Text>}
    </ActionDialog>
  );
};

PermissionGroupDeleteDialog.displayName = "PermissionGroupDeleteDialog";
export default PermissionGroupDeleteDialog;
