// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
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
  onSubmit,
}) => {
  const intl = useIntl();
  const formFields = ["payment"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <Form
        initial={{
          amount: initial,
        }}
        onSubmit={onSubmit}
      >
        {({ data, change, submit }) => (
          <>
            <DialogTitle disableTypography>
              {intl.formatMessage({
                id: "+PbHKD",
                defaultMessage: "Capture Payment",
                description: "dialog header",
              })}
            </DialogTitle>
            <DialogContent>
              <TextField
                error={!!formErrors.payment}
                fullWidth
                helperText={getOrderErrorMessage(formErrors.payment, intl)}
                label={intl.formatMessage({
                  id: "OhdPS1",
                  defaultMessage: "Amount",
                  description: "amount of refunded money",
                })}
                name="amount"
                onChange={change}
                inputProps={{
                  step: "0.01",
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
              <BackButton onClick={onClose} />
              <ConfirmButton transitionState={confirmButtonState} onClick={submit}>
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
