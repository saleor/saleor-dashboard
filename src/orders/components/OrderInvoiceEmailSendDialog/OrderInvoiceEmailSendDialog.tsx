import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { InvoiceErrorFragment, InvoiceFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import getInvoiceErrorMessage from "@dashboard/utils/errors/invoice";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderInvoiceEmailSendDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: InvoiceErrorFragment[];
  invoice: InvoiceFragment;
  onSend: () => void;
}

const OrderInvoiceEmailSendDialog: React.FC<OrderInvoiceEmailSendDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  invoice,
  onClose,
  onSend,
}) => {
  const intl = useIntl();

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Title>
          {intl.formatMessage({
            id: "5JT4v2",
            defaultMessage: "Send Invoice",
            description: "dialog header",
          })}
        </DashboardModal.Title>

        <Text>
          <FormattedMessage
            id="MPfyne"
            defaultMessage="Are you sure you want to send this invoice: {invoiceNumber} to the customer?"
            values={{
              invoiceNumber: <strong>{invoice?.number}</strong>,
            }}
          />
        </Text>

        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors.map((err, idx) => (
              <Text key={idx} display="block" color="critical1">
                {getInvoiceErrorMessage(err, intl)}
              </Text>
            ))}
          </>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton transitionState={confirmButtonState} onClick={onSend}>
            <FormattedMessage {...buttonMessages.send} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";
export default OrderInvoiceEmailSendDialog;
