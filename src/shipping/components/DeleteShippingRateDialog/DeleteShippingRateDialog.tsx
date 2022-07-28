import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface DeleteShippingRateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  handleConfirm: () => void;
}

export const DeleteShippingRateDialog: React.FC<DeleteShippingRateDialogProps> = ({
  confirmButtonState,
  onClose,
  handleConfirm,
  name,
  open,
}) => {
  const intl = useIntl();
  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      title={intl.formatMessage({
        id: "nNeWAx",
        defaultMessage: "Delete Shipping Method",
        description: "dialog header",
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          id="yOaNWB"
          defaultMessage="Are you sure you want to delete {name}?"
          description="delete shipping method"
          values={{
            name: getStringOrPlaceholder(name),
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};

export default DeleteShippingRateDialog;
