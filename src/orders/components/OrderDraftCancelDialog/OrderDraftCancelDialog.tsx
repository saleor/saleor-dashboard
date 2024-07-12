import NewActionDialog from "@dashboard/components/ActionDialog/NewActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderDraftCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

const OrderDraftCancelDialog: React.FC<OrderDraftCancelDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  onClose,
  onConfirm,
  open,
  orderNumber,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <NewActionDialog
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={intl.formatMessage({
        id: "APcoSA",
        defaultMessage: "Delete Daft Order",
        description: "dialog header",
      })}
      variant="delete"
    >
      <FormattedMessage
        id="mxtAFx"
        defaultMessage="Are you sure you want to delete draft #{orderNumber}?"
        values={{
          orderNumber: <strong>{orderNumber}</strong>,
        }}
      />

      {errors.length > 0 && (
        <>
          <FormSpacer />
          {errors.map((err, index) => (
            <Text color="critical1" key={index}>
              {getOrderErrorMessage(err, intl)}
            </Text>
          ))}
        </>
      )}
    </NewActionDialog>
  );
};

OrderDraftCancelDialog.displayName = "OrderDraftCancelDialog";
export default OrderDraftCancelDialog;
