import { DashboardCard } from "@dashboard/components/Card";
import { commonMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import {
  OrderManualTransactionForm,
  OrderManualTransactionFormProps,
} from "../../OrderManualTransactionForm";
import { manualRefundMessages, refundPageMessages } from "../messages";
import { useManualRefundCardStyles } from "../styles";

export const ManualRefundCard = (props: OrderManualTransactionFormProps) => {
  const classes = useManualRefundCardStyles();
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...manualRefundMessages.refundManual} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text>
          <FormattedMessage {...manualRefundMessages.refundManualDescription} />
        </Text>
      </DashboardCard.Content>
      <OrderManualTransactionForm {...props}>
        <div className={classes.wrapper}>
          <OrderManualTransactionForm.Form className={classes.form}>
            <OrderManualTransactionForm.DescriptionField
              className={classes.descriptionInput}
              label={intl.formatMessage(commonMessages.descriptionOptional)}
            />
            <OrderManualTransactionForm.PspReferenceField
              className={classes.pspReferenceInput}
              label={intl.formatMessage(commonMessages.pspReferenceOptional)}
            />
            <OrderManualTransactionForm.PriceInputField
              className={classes.priceInput}
              label={intl.formatMessage(refundPageMessages.refundAmount)}
            />
            <OrderManualTransactionForm.SubmitButton className={classes.submitButton}>
              <FormattedMessage {...manualRefundMessages.refund} />
            </OrderManualTransactionForm.SubmitButton>
          </OrderManualTransactionForm.Form>
        </div>
      </OrderManualTransactionForm>
    </DashboardCard>
  );
};
