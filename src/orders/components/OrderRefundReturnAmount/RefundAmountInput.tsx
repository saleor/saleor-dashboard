import PriceField from "@saleor/components/PriceField";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderDetails_order_payments } from "@saleor/orders/types/OrderDetails";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(1, 0)
    },
    maxRefundRow: {
      fontWeight: 600
    },
    priceField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    refundButton: {
      marginTop: theme.spacing(2)
    },
    refundCaution: {
      marginTop: theme.spacing(1)
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "OrderRefundAmount" }
);

interface RefundAmountInputProps {
  payment: OrderDetails_order_payments;
  data: OrderRefundFormData;
  currencySymbol: string;
  amountTooSmall: boolean;
  amountTooBig: boolean;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  amountTooBig: {
    defaultMessage: "Amount cannot be bigger than max refund",
    description: "Amount error message"
  },
  amountTooSmall: {
    defaultMessage: "Amount must be bigger than 0",
    description: "Amount error message"
  },
  label: {
    defaultMessage: "Amount",
    description: "order refund amount, input label"
  }
});

const RefundAmountInput: React.FC<RefundAmountInputProps> = props => {
  const {
    payment,
    data,
    amountTooSmall,
    amountTooBig,
    currencySymbol,
    disabled,
    errors,
    onChange
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const maxRefund = payment?.availableRefundAmount;
  const currentPayment = data.paymentsToRefund?.find(p => p.id === payment?.id);
  const paymentAmountTooBig =
    Number(currentPayment?.value) > payment?.availableRefundAmount?.amount;
  const formErrors = getFormErrors(["paymentsToRefund"], errors);
  const isError =
    !!formErrors.paymentsToRefund ||
    amountTooSmall ||
    amountTooBig ||
    paymentAmountTooBig;

  return (
    <PriceField
      disabled={disabled}
      onChange={onChange}
      currencySymbol={
        "/ " + currencySymbol + " " + maxRefund?.amount.toFixed(2)
      }
      name={"amount" as keyof FormData}
      value={currentPayment?.value}
      label={intl.formatMessage(messages.label)}
      className={classes.priceField}
      InputProps={{ inputProps: { max: maxRefund?.amount } }}
      inputProps={{
        "data-test": "amountInput",
        max: maxRefund?.amount
      }}
      error={isError}
      hint={
        getOrderErrorMessage(formErrors.paymentsToRefund, intl) ||
        (amountTooSmall && intl.formatMessage(messages.amountTooSmall)) ||
        (amountTooBig && intl.formatMessage(messages.amountTooBig)) ||
        (paymentAmountTooBig && intl.formatMessage(messages.amountTooBig))
      }
    />
  );
};

export default RefundAmountInput;
