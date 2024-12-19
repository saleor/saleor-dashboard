import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { commonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import {
  OrderManualTransactionForm,
  OrderManualTransactionFormProps,
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
          <DashboardModal.Header>
            <FormattedMessage {...manualTransactionMessages.dialogTitle} />
          </DashboardModal.Header>

          <OrderManualTransactionForm.Form>
            <Box display="flex" flexDirection="column" gap={4}>
              <Text size={2}>
                <FormattedMessage {...manualTransactionMessages.dialogDescription} />
              </Text>
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

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />

                <OrderManualTransactionForm.SubmitButton size="medium">
                  <Text fontWeight="medium" color="buttonDefaultPrimary">
                    <FormattedMessage {...manualTransactionMessages.submitButton} />
                  </Text>
                </OrderManualTransactionForm.SubmitButton>
              </DashboardModal.Actions>
            </Box>
          </OrderManualTransactionForm.Form>
        </DashboardModal.Content>
      </DashboardModal>
    </OrderManualTransactionForm>
  );
};
