// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderPaymentVoidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose?: () => any;
  onConfirm?: () => any;
}

const OrderPaymentVoidDialog: React.FC<OrderPaymentVoidDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  onConfirm,
  onClose,
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle disableTypography>
        <FormattedMessage id="KszPFx" defaultMessage="Void Payment" description="dialog header" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="euRfu+"
            defaultMessage="Are you sure you want to void this payment?"
          />
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
        <BackButton onClick={onClose} />
        <ConfirmButton transitionState={confirmButtonState} onClick={onConfirm}>
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderPaymentVoidDialog.displayName = "OrderPaymentVoidDialog";
export default OrderPaymentVoidDialog;
