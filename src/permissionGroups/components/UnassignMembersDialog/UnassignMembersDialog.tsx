import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface UnassignMembersDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  quantity: number;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const UnassignMembersDialog: React.FC<UnassignMembersDialogProps> = ({
  confirmButtonState,
  quantity,
  onClose,
  onConfirm,
  open,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        id: "lT5MYM",
        defaultMessage: "Unassign users",
        description: "dialog title",
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          id="XGBsoK"
          defaultMessage="Are you sure you want to unassign {counter,plural,one{this member} other{{displayQuantity} members}}?"
          description="dialog content"
          values={{
            counter: quantity,
            displayQuantity: <strong>{quantity}</strong>,
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
UnassignMembersDialog.displayName = "UnassignMembersDialog";
export default UnassignMembersDialog;
