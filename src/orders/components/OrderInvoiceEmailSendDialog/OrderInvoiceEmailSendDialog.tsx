import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type InvoiceErrorFragment, type InvoiceFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { type DialogProps } from "@dashboard/types";
import getInvoiceErrorMessage from "@dashboard/utils/errors/invoice";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { orderInvoiceEmailSendDialogMessages } from "./messages";

interface OrderInvoiceEmailSendDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: InvoiceErrorFragment[];
  invoice: InvoiceFragment;
  onSend: () => void;
}

const OrderInvoiceEmailSendDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  invoice,
  onClose,
  onSend,
}: OrderInvoiceEmailSendDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...orderInvoiceEmailSendDialogMessages.description}
              values={{
                invoiceNumber: invoice?.number,
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />
          }
        >
          <FormattedMessage {...orderInvoiceEmailSendDialogMessages.title} />
        </DashboardModal.Header>

        {errors.length > 0 && (
          <DashboardModal.Body>
            <DashboardModal.Inset>
              {errors.map((err, index) => (
                <Text display="block" color="critical1" key={index} data-test-id="dialog-error">
                  {getInvoiceErrorMessage(err, intl)}
                </Text>
              ))}
            </DashboardModal.Inset>
          </DashboardModal.Body>
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
