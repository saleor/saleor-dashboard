import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderMarkAsPaidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  transactionReference: string;
  onClose: () => void;
  onConfirm: () => void;
  handleTransactionReference: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderMarkAsPaidDialog: React.FC<OrderMarkAsPaidDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  handleTransactionReference,
  onClose,
  onConfirm,
  open,
  transactionReference,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      title={intl.formatMessage({
        id: "+B25o/",
        defaultMessage: "Mark Order as Paid",
        description: "dialog header",
      })}
      onClose={onClose}
      onConfirm={onConfirm}
      size="lg"
    >
      <Box display="grid" gap={4}>
        <FormattedMessage id="sfEbeB" defaultMessage="You're going to mark this order as paid." />

        <FormattedMessage
          id="rwOx2s"
          defaultMessage="Please provide a transaction reference using the input below:"
        />

        <TextField
          fullWidth
          name="transactionReference"
          label={intl.formatMessage({
            id: "EbVf0Z",
            defaultMessage: "Transaction reference",
            description: "transaction reference",
          })}
          value={transactionReference}
          onChange={handleTransactionReference}
          data-test-id="transaction-reference-input"
        />

        {errors.length > 0 && (
          <Box display="grid" gap={1}>
            {errors.map((err, index) => (
              <Text color="critical1" key={index}>
                {getOrderErrorMessage(err, intl)}
              </Text>
            ))}
          </Box>
        )}
      </Box>
    </ActionDialog>
  );
};

OrderMarkAsPaidDialog.displayName = "OrderMarkAsPaidDialog";
export default OrderMarkAsPaidDialog;
