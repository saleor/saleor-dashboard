import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderMarkAsPaidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OrderMarkAsPaidDialog: React.FC<OrderMarkAsPaidDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      title={intl.formatMessage({
        defaultMessage: "Mark Order as Paid",
        description: "dialog header"
      })}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <DialogContentText>
        <FormattedMessage defaultMessage="Are you sure you want to mark this order as paid?" />
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
    </ActionDialog>
  );
};
OrderMarkAsPaidDialog.displayName = "OrderMarkAsPaidDialog";
export default OrderMarkAsPaidDialog;
