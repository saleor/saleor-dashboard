import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeValueDeleteDialogProps {
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  useName?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const AttributeValueDeleteDialog: React.FC<AttributeValueDeleteDialogProps> = ({
  attributeName,
  name,
  confirmButtonState,
  useName,
  onClose,
  onConfirm,
  open
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
        defaultMessage: "Delete attribute value",
        description: "dialog title"
      })}
    >
      <DialogContentText>
        {useName ? (
          <FormattedMessage
            defaultMessage='Are you sure you want to delete "{name}" value? If you delete it you won’t be able to assign it to any of the products with "{attributeName}" attribute.'
            values={{
              attributeName,
              name
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage='Are you sure you want to delete "{name}" value?'
            description="delete attribute value"
            values={{
              name
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};

AttributeValueDeleteDialog.displayName = "AttributeValueDeleteDialog";
export default AttributeValueDeleteDialog;
