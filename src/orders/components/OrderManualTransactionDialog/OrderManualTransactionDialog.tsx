import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { commonMessages } from "@dashboard/intl";
import { type DialogProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import {
  OrderManualTransactionForm,
  type OrderManualTransactionFormProps,
} from "../OrderManualTransactionForm";
import { manualTransactionMessages } from "./messages";

const ORDER_MANUAL_TRANSACTION_FORM_ID = "order-manual-transaction-form";

type OrderManualTransactionDialogProps = {
  dialogProps: DialogProps;
} & OrderManualTransactionFormProps;

export const OrderManualTransactionDialog = ({
  dialogProps,
  ...props
}: OrderManualTransactionDialogProps) => {
  const intl = useIntl();
  const { onClose } = dialogProps;

  return (
    <OrderManualTransactionForm {...props}>
      <DashboardModal {...dialogProps} onChange={onClose}>
        <DashboardModal.Content size="xs">
          <DashboardModal.Header
            subtitle={intl.formatMessage(manualTransactionMessages.dialogDescription)}
          >
            {intl.formatMessage(manualTransactionMessages.dialogTitle)}
          </DashboardModal.Header>

          <DashboardModal.Body>
            <DashboardModal.Inset>
              <OrderManualTransactionForm.Form id={ORDER_MANUAL_TRANSACTION_FORM_ID}>
                <Box display="flex" flexDirection="column" gap={4}>
                  <OrderManualTransactionForm.DescriptionField
                    label={intl.formatMessage(commonMessages.description)}
                    fullWidth
                  />
                  <OrderManualTransactionForm.PspReferenceField
                    label={intl.formatMessage(commonMessages.pspReferenceOptional)}
                    fullWidth
                  />
                  <OrderManualTransactionForm.PriceInputField
                    label={intl.formatMessage(manualTransactionMessages.transactionAmount)}
                  />
                  <OrderManualTransactionForm.ErrorText />
                </Box>
              </OrderManualTransactionForm.Form>
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton onClick={onClose} />
            <OrderManualTransactionForm.SubmitButton
              form={ORDER_MANUAL_TRANSACTION_FORM_ID}
              size="medium"
            >
              <FormattedMessage {...manualTransactionMessages.submitButton} />
            </OrderManualTransactionForm.SubmitButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
    </OrderManualTransactionForm>
  );
};
