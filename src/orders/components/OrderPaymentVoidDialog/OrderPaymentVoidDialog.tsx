import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { PaymentErrorFragment } from "@saleor/fragments/types/PaymentErrorFragment";
import { buttonMessages } from "@saleor/intl";
import getOrderPaymentErrorMessage from "@saleor/utils/errors/orderPayment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderPaymentVoidDialogMessages as messages } from "./messages";

export interface OrderPaymentVoidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: PaymentErrorFragment[];
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
        <FormattedMessage {...messages.voidPayment} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage {...messages.voidPaymentConfirm} />
        </DialogContentText>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors.map((err, index) => (
              <DialogContentText color="error" key={index}>
                {getOrderPaymentErrorMessage(err, intl)}
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
