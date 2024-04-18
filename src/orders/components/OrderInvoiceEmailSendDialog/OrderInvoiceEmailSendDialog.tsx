import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { InvoiceErrorFragment, InvoiceFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import getInvoiceErrorMessage from "@dashboard/utils/errors/invoice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderInvoiceEmailSendDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: InvoiceErrorFragment[];
  invoice: InvoiceFragment;
  onSend: () => void;
}

const OrderInvoiceEmailSendDialog: React.FC<OrderInvoiceEmailSendDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  invoice,
  onClose,
  onSend,
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle disableTypography>
        {intl.formatMessage({
          id: "5JT4v2",
          defaultMessage: "Send Invoice",
          description: "dialog header",
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="MPfyne"
            defaultMessage="Are you sure you want to send this invoice: {invoiceNumber} to the customer?"
            values={{
              invoiceNumber: <strong>{invoice?.number}</strong>,
            }}
          />
        </DialogContentText>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors.map((err, idx) => (
              <DialogContentText key={idx} color="error">
                {getInvoiceErrorMessage(err, intl)}
              </DialogContentText>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton transitionState={confirmButtonState} onClick={onSend}>
          <FormattedMessage {...buttonMessages.send} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";
export default OrderInvoiceEmailSendDialog;
