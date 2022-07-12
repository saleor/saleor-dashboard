import { DialogContentText, TextField } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import FormSpacer from "@saleor/components/FormSpacer";
import { OrderErrorFragment } from "@saleor/graphql";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderMarkAsPaidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  transactionReference: string;
  onClose: () => void;
  onConfirm: () => void;
  handleTransactionReference: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderMarkAsPaidDialog: React.FC<OrderMarkAsPaidDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  handleTransactionReference,
  onClose,
  onConfirm,
  open,
  transactionReference,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      title={intl.formatMessage({
        id: "+B25o/",
        defaultMessage: "Mark Order as Paid",
        description: "dialog header",
      })}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <DialogContentText>
        <FormattedMessage
          id="sfEbeB"
          defaultMessage="You're going to mark this order as paid."
        />
        <br />
        <FormattedMessage
          id="rwOx2s"
          defaultMessage="Please provide a transaction reference using the input below:"
        />
      </DialogContentText>
      <TextField
        fullWidth
        name="transactionReference"
        label={intl.formatMessage({
          id: "EbVf0Z",
          defaultMessage: "Transaction reference",
          description: "transaction reference",
        })}
        value={transactionReference}
        onChange={handleTransactionReference}
      />
      {errors.length > 0 && (
        <>
          <FormSpacer />
          {errors.map((err, index) => (
            <DialogContentText color="error" key={index}>
              {getOrderErrorMessage(err, intl)}
            </DialogContentText>
          ))}
        </>
      )}
    </ActionDialog>
  );
};
OrderMarkAsPaidDialog.displayName = "OrderMarkAsPaidDialog";
export default OrderMarkAsPaidDialog;
