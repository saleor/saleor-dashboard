import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
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
      <CardTitle
        title={<FormattedMessage {...manualRefundMessages.refundManual} />}
      ></CardTitle>
      <CardContent>
        <Typography>
          <FormattedMessage {...manualRefundMessages.refundManualDescription} />
        </Typography>
      </CardContent>
      <div className={classes.wrapper}>
        <OrderManualTransactionForm
          {...props}
          className={classes.form}
          descriptionFieldProps={{
            className: classes.descriptionInput,
            label: intl.formatMessage(commonMessages.description),
          }}
          priceFieldProps={{
            className: classes.priceInput,
            label: intl.formatMessage(refundPageMessages.refundAmount),
          }}
          submitButtonProps={{
            children: intl.formatMessage(manualRefundMessages.refund),
            className: classes.submitButton,
          }}
        />
      </div>
    </Card>
  );
};
