import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { buttonMessages } from "@saleor/intl";

export interface FormData {
  amount: number;
}

interface OrderPaymentDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  initial: number;
  variant: string;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const OrderPaymentDialog: React.FC<OrderPaymentDialogProps> = ({
  confirmButtonState,
  open,
  initial,
  variant,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <Form
        initial={{
          amount: initial
        }}
        onSubmit={data => {
          onSubmit(data);
          onClose();
        }}
      >
        {({ data, change, submit }) => (
          <>
            <DialogTitle>
              {variant === "capture"
                ? intl.formatMessage({
                    defaultMessage: "Capture Payment",
                    description: "dialog header"
                  })
                : intl.formatMessage({
                    defaultMessage: "Refund Payment",
                    description: "dialog header"
                  })}
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Amount",
                  description: "amount of refunded money"
                })}
                name="amount"
                onChange={change}
                inputProps={{
                  step: "0.01"
                }}
                type="number"
                value={data.amount}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                transitionState={confirmButtonState}
                color="primary"
                variant="contained"
                onClick={() => {
                  onClose();
                  submit();
                }}
              >
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
OrderPaymentDialog.displayName = "OrderPaymentDialog";
export default OrderPaymentDialog;
