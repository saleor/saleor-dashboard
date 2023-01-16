import ActionDialog from "@dashboard/components/ActionDialog";
import { DialogContentText } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const AttributeDeleteDialog: React.FC<AttributeDeleteDialogProps> = ({
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
        id: "JI2Xwp",
        defaultMessage: "Delete attribute",
        description: "dialog title",
      })}
    >
      <DialogContentText>
        <FormattedMessage
          id="h1rPPg"
          defaultMessage="Are you sure you want to delete {attributeName}?"
          description="dialog content"
          values={{
            attributeName: <strong>{name}</strong>,
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};

AttributeDeleteDialog.displayName = "AttributeDeleteDialog";
export default AttributeDeleteDialog;
