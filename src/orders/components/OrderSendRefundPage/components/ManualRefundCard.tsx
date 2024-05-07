import CardTitle from "@dashboard/components/CardTitle";
import { commonMessages } from "@dashboard/intl";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  OrderManualTransactionForm,
  OrderManualTransactionFormProps,
} from "../../OrderManualTransactionForm";
import { manualRefundMessages, refundPageMessages } from "../messages";
import { useManualRefundCardStyles } from "../styles";

export const ManualRefundCard: React.FC<OrderManualTransactionFormProps> = props => {
  const classes = useManualRefundCardStyles();
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={<FormattedMessage {...manualRefundMessages.refundManual} />}></CardTitle>
      <CardContent>
        <Typography>
          <FormattedMessage {...manualRefundMessages.refundManualDescription} />
        </Typography>
      </CardContent>
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
          <OrderManualTransactionForm.ErrorText />
        </div>
      </OrderManualTransactionForm>
    </Card>
  );
};
