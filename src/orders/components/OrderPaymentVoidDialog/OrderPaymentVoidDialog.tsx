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
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { buttonMessages } from "@saleor/intl";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderPaymentVoidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose?();
  onConfirm?();
}

const OrderPaymentVoidDialog: React.FC<OrderPaymentVoidDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  onConfirm,
  onClose
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Void Payment"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage defaultMessage="Are you sure you want to void this payment?" />
        </DialogContentText>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          onClick={onConfirm}
        >
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderPaymentVoidDialog.displayName = "OrderPaymentVoidDialog";
export default OrderPaymentVoidDialog;
