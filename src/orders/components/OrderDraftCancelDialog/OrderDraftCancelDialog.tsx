import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderDraftCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

const OrderDraftCancelDialog = ({
  confirmButtonState,
  errors: apiErrors,
  onClose,
  onConfirm,
  open,
  orderNumber,
}: OrderDraftCancelDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={intl.formatMessage({
        id: "Yk0avO",
        defaultMessage: "Delete Draft Order",
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
    </ActionDialog>
  );
};

OrderDraftCancelDialog.displayName = "OrderDraftCancelDialog";
export default OrderDraftCancelDialog;
