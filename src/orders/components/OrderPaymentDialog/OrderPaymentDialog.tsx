import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { buttonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  amount: number;
}

export interface OrderPaymentDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  initial: number;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const OrderPaymentDialog: React.FC<OrderPaymentDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  initial,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();

  const formFields = ["payment"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <Form
        initial={{
          amount: initial
        }}
        onSubmit={onSubmit}
      >
        {({ data, change, submit }) => (
          <>
            <DialogTitle>
              {intl.formatMessage({
                defaultMessage: "Capture Payment",
                description: "dialog header"
              })}
            </DialogTitle>
            <DialogContent>
              <TextField
                error={!!formErrors.payment}
                fullWidth
                helperText={getOrderErrorMessage(formErrors.payment, intl)}
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
              {errors.length > 0 && (
                <>
                  <FormSpacer />
                  {errors
                    .filter(err => !formFields.includes(err.field))
                    .map((err, index) => (
                      <DialogContentText color="error" key={index}>
                        {getOrderErrorMessage(err, intl)}
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
                onClick={submit}
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
