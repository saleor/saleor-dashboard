import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
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

import { orderCaptureDialogMessages as messages } from "./messages";

export interface FormData {
  amount: number;
}

export interface OrderCaptureDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  initial: number;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const OrderCaptureDialog: React.FC<OrderCaptureDialogProps> = ({
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
              <FormattedMessage {...messages.captureOrder} />
            </DialogTitle>
            <DialogContent>
              <TextField
                error={!!formErrors.payment}
                fullWidth
                helperText={getOrderErrorMessage(formErrors.payment, intl)}
                label={intl.formatMessage(messages.captureAmount)}
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
OrderCaptureDialog.displayName = "OrderCaptureDialog";
export default OrderCaptureDialog;
