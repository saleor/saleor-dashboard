import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { buttonMessages } from "@saleor/intl";
import { OrderErrorFragment } from "@saleor/orders/types/OrderErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import { getFormErrors } from "@saleor/utils/errors";
import FormSpacer from "@saleor/components/FormSpacer";

export interface FormData {
  trackingNumber: string;
}

export interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  trackingNumber: string;
  onClose();
  onConfirm(data: FormData);
}

const OrderFulfillmentTrackingDialog: React.FC<OrderFulfillmentTrackingDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  trackingNumber,
  onConfirm,
  onClose
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  const formFields = ["trackingNumber"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <Form initial={{ trackingNumber }} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Add Tracking Code"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                error={!!formErrors.trackingNumber}
                helperText={getOrderErrorMessage(
                  formErrors.trackingNumber,
                  intl
                )}
                label={intl.formatMessage({
                  defaultMessage: "Tracking number"
                })}
                name="trackingNumber"
                onChange={change}
                value={data.trackingNumber}
                fullWidth
              />
              {errors.length > 0 && (
                <>
                  <FormSpacer />
                  {errors
                    .filter(err => !formFields.includes(err.field))
                    .map(err => (
                      <DialogContentText color="error">
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
OrderFulfillmentTrackingDialog.displayName = "OrderFulfillmentTrackingDialog";
export default OrderFulfillmentTrackingDialog;
