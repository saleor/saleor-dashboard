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

          <OrderManualTransactionForm.Form>
            <DashboardModal.Body>
              <DashboardModal.Inset>
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
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <OrderManualTransactionForm.SubmitButton size="medium">
                <FormattedMessage {...manualTransactionMessages.submitButton} />
              </OrderManualTransactionForm.SubmitButton>
            </DashboardModal.Actions>
          </OrderManualTransactionForm.Form>
        </DashboardModal.Content>
      </DashboardModal>
    </OrderManualTransactionForm>
  );
};
