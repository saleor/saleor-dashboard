import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";

interface OrderPaymentVoidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose?();
  onConfirm?();
}

const OrderPaymentVoidDialog: React.FC<OrderPaymentVoidDialogProps> = ({
  confirmButtonState,
  open,
  onConfirm,
  onClose
}) => (
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
OrderPaymentVoidDialog.displayName = "OrderPaymentVoidDialog";
export default OrderPaymentVoidDialog;
