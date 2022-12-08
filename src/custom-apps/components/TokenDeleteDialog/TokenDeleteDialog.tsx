import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface TokenDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const TokenDeleteDialog: React.FC<TokenDeleteDialogProps> = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      confirmButtonState={confirmButtonState}
      onConfirm={onConfirm}
      variant="delete"
      title={intl.formatMessage({
        id: "quV5zH",
        defaultMessage: "Delete Token",
        description: "dialog title",
      })}
    >
      <DialogContentText>
        <FormattedMessage
          id="2VSP8C"
          defaultMessage="Are you sure you want to delete token {token}?"
          description="delete token"
          values={{
            token: <strong>{name}</strong>,
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};

TokenDeleteDialog.displayName = "TokenDeleteDialog";
export default TokenDeleteDialog;
