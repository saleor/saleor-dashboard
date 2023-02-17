import BackButton from "@dashboard/components/BackButton";
import ConfirmButton from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  number: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const OrderCancelDialog: React.FC<OrderCancelDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    number: orderNumber,
    open,
    onSubmit,
    onClose,
  } = props;

  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle disableTypography>
        <FormattedMessage
          id="PRXpBm"
          defaultMessage="Cancel Order"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText key="cancel">
          <FormattedMessage
            id="VSztEE"
            defaultMessage="Cancelling this order will release unfulfilled stocks, so they can be bought by other customers. <b>Order will not be refunded when cancelling order - You need to do it manually.</b> Are you sure you want to cancel this order?"
            values={{
              b: (...chunks) => <b>{chunks}</b>,
              orderNumber,
            }}
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
        <ConfirmButton
          onClick={onSubmit}
          transitionState={confirmButtonState}
          type="submit"
        >
          <FormattedMessage {...buttonMessages.accept} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderCancelDialog.displayName = "OrderCancelDialog";
export default OrderCancelDialog;
