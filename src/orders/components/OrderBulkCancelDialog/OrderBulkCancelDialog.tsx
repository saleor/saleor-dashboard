import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";

export interface OrderBulkCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  numberOfOrders: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (restock: boolean) => void;
}

const OrderBulkCancelDialog: React.FC<OrderBulkCancelDialogProps> = ({
  confirmButtonState,
  numberOfOrders,
  open,
  onClose,
  onConfirm
}) => {
  const intl = useIntl();
  const [restock, setRestock] = React.useState(true);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      variant="delete"
      title={intl.formatMessage({
        defaultMessage: "Cancel Orders",
        description: "dialog header"
      })}
      onClose={onClose}
      onConfirm={() => onConfirm(restock)}
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="{counter,plural,one{Are you sure you want to cancel this order?} other{Are you sure you want to cancel {displayQuantity} orders?}}"
          values={{
            counter: numberOfOrders,
            displayQuantity: <strong>{numberOfOrders}</strong>
          }}
        />
      </DialogContentText>
      <ControlledCheckbox
        checked={restock}
        label={intl.formatMessage({
          defaultMessage: "Release all stock allocated to these orders",
          description: "switch button"
        })}
        name="restock"
        onChange={event => setRestock(event.target.value)}
      />
    </ActionDialog>
  );
};
OrderBulkCancelDialog.displayName = "OrderBulkCancelDialog";
export default OrderBulkCancelDialog;
