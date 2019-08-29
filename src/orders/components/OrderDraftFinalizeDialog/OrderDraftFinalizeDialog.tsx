import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export type OrderDraftFinalizeWarning =
  | "no-shipping"
  | "no-billing"
  | "no-user"
  | "no-shipping-method"
  | "unnecessary-shipping-method";

export interface OrderDraftFinalizeDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  orderNumber: string;
  warnings: OrderDraftFinalizeWarning[];
  onClose: () => void;
  onConfirm: () => void;
}

const warningToText = (warning: OrderDraftFinalizeWarning, intl: IntlShape) => {
  switch (warning) {
    case "no-shipping":
      return intl.formatMessage({
        defaultMessage: "No shipping address"
      });
    case "no-billing":
      return intl.formatMessage({
        defaultMessage: "No billing address"
      });
    case "no-user":
      return intl.formatMessage({
        defaultMessage: "No user information"
      });
    case "no-shipping-method":
      return intl.formatMessage({
        defaultMessage: "Some products require shipping, but no method provided"
      });
    case "unnecessary-shipping-method":
      return intl.formatMessage({
        defaultMessage: "Shipping method provided, but no product requires it"
      });
  }
};

const OrderDraftFinalizeDialog: React.StatelessComponent<
  OrderDraftFinalizeDialogProps
> = ({
  confirmButtonState,
  open,
  warnings,
  onClose,
  onConfirm,
  orderNumber
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={intl.formatMessage({
        defaultMessage: "Finalize draft order",
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
                <li key={warning}>{warningToText(warning, intl)}</li>
              ))}
            </ul>
          </>
        )}
        <FormattedMessage
          defaultMessage="Are you sure you want to finalize draft #{number}?"
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
