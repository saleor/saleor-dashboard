import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { InvoiceErrorFragment } from "@saleor/fragments/types/InvoiceErrorFragment";
import { InvoiceFragment } from "@saleor/fragments/types/InvoiceFragment";
import { buttonMessages } from "@saleor/intl";
import { DialogProps } from "@saleor/types";
import getInvoiceErrorMessage from "@saleor/utils/errors/invoice";
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
  onSend
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        {intl.formatMessage({
          defaultMessage: "Send Invoice",
          description: "dialog header"
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to send this invoice: {invoiceNumber} to the customer?"
            values={{
              invoiceNumber: <strong>{invoice?.number}</strong>
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
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          onClick={onSend}
        >
          <FormattedMessage {...buttonMessages.send} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";
export default OrderInvoiceEmailSendDialog;
