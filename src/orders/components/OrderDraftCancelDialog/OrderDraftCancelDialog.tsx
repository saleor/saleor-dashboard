import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export interface OrderDraftCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

const OrderDraftCancelDialog: React.StatelessComponent<
  OrderDraftCancelDialogProps
> = ({ confirmButtonState, onClose, onConfirm, open, orderNumber }) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={intl.formatMessage({
        defaultMessage: "Delete Daft Order",
        description: "dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to delete draft #{number}?"
          values={{
            orderNumber
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
OrderDraftCancelDialog.displayName = "OrderDraftCancelDialog";
export default OrderDraftCancelDialog;
