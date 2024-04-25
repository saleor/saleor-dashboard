// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
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
  trackingNumber: string;
}

export interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  trackingNumber: string;
  onClose: () => any;
  onConfirm: (data: FormData) => any;
}

const OrderFulfillmentTrackingDialog: React.FC<OrderFulfillmentTrackingDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  trackingNumber,
  onConfirm,
  onClose,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const formFields = ["trackingNumber"];
  const formErrors = getFormErrors(formFields, errors);
  const initialData: FormData = {
    trackingNumber: trackingNumber || "",
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <Form initial={initialData} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle disableTypography>
              <FormattedMessage
                id="/BJQIq"
                defaultMessage="Add Tracking Code"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                error={!!formErrors.trackingNumber}
                helperText={getOrderErrorMessage(formErrors.trackingNumber, intl)}
                label={intl.formatMessage({
                  id: "yT/GAp",
                  defaultMessage: "Tracking number",
                })}
                name="trackingNumber"
                onChange={change}
                value={data.trackingNumber}
                fullWidth
                data-test-id="tracking-number-input"
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
              <ConfirmButton
                data-test-id="confirm-tracking-number-button"
                transitionState={confirmButtonState}
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
