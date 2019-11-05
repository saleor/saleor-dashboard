import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export enum OrderDraftFinalizeWarning {
  NO_SHIPPING,
  NO_BILLING,
  NO_USER,
  NO_SHIPPING_METHOD,
  UNNECESSARY_SHIPPING_METHOD
}

export interface OrderDraftFinalizeDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  orderNumber: string;
  warnings: OrderDraftFinalizeWarning[];
  onClose: () => void;
  onConfirm: () => void;
}

function translateWarnings(
  intl: IntlShape
): Record<OrderDraftFinalizeWarning, string> {
  return {
    [OrderDraftFinalizeWarning.NO_BILLING]: intl.formatMessage({
      defaultMessage: "No billing address"
    }),
    [OrderDraftFinalizeWarning.NO_SHIPPING]: intl.formatMessage({
      defaultMessage: "No shipping address"
    }),
    [OrderDraftFinalizeWarning.NO_SHIPPING_METHOD]: intl.formatMessage({
      defaultMessage: "Some products require shipping, but no method provided"
    }),
    [OrderDraftFinalizeWarning.NO_USER]: intl.formatMessage({
      defaultMessage: "No user information"
    }),
    [OrderDraftFinalizeWarning.UNNECESSARY_SHIPPING_METHOD]: intl.formatMessage(
      {
        defaultMessage: "Shipping method provided, but no product requires it"
      }
    )
  };
}

const OrderDraftFinalizeDialog: React.FC<OrderDraftFinalizeDialogProps> = ({
  confirmButtonState,
  open,
  warnings,
  onClose,
  onConfirm,
  orderNumber
}) => {
  const intl = useIntl();
  const translatedWarnings = translateWarnings(intl);

  return (
    <ActionDialog
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={intl.formatMessage({
        defaultMessage: "Finalize Draft Order",
        description: "dialog header"
      })}
      confirmButtonLabel={
        warnings.length > 0
          ? intl.formatMessage({
              defaultMessage: "Finalize anyway",
              description: "button"
            })
          : intl.formatMessage({
              defaultMessage: "Finalize",
              description: "button"
            })
      }
      confirmButtonState={confirmButtonState}
      variant={warnings.length > 0 ? "delete" : "default"}
    >
      <DialogContentText component="div">
        {warnings.length > 0 && (
          <>
            <p>
              <FormattedMessage defaultMessage="There are missing or incorrect informations about this order:" />
            </p>
            <ul>
              {warnings.map(warning => (
                <li key={warning}>{translatedWarnings[warning]}</li>
              ))}
            </ul>
          </>
        )}
        <FormattedMessage
          defaultMessage="Are you sure you want to finalize draft #{orderNumber}?"
          values={{
            orderNumber
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
OrderDraftFinalizeDialog.displayName = "OrderDraftFinalize";
export default OrderDraftFinalizeDialog;
