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
  trackingNumber: string;
}

interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  trackingNumber: string;
  onClose();
  onConfirm(data: FormData);
}

const OrderFulfillmentTrackingDialog: React.StatelessComponent<
  OrderFulfillmentTrackingDialogProps
> = ({ confirmButtonState, open, trackingNumber, onConfirm, onClose }) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
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
                label={intl.formatMessage({
                  defaultMessage: "Tracking number"
                })}
                name="trackingNumber"
                onChange={change}
                value={data.trackingNumber}
                fullWidth
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
