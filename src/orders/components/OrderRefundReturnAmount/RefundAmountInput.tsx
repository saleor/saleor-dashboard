import PriceField from "@saleor/components/PriceField";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderDetails_order_payments } from "@saleor/orders/types/OrderDetails";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { getById } from "../OrderReturnPage/utils";

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
  disabled: boolean;
  errors: OrderErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  amountTooBig: {
    defaultMessage: "Amount cannot be bigger than methods captured amount",
    description: "Amount error message"
  },
  amountTooSmall: {
    defaultMessage: "Amount cannot be less than 0",
    description: "Amount error message"
  },
  label: {
    defaultMessage: "Amount",
    description: "order refund amount, input label"
  }
});

const RefundAmountInput: React.FC<RefundAmountInputProps> = props => {
  const { payment, data, currencySymbol, disabled, errors, onChange } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const maxRefund = payment.availableRefundAmount;
  const currentPayment = data.paymentsToRefund?.find(getById(payment.id));
  const amountTooBig =
    Number(currentPayment?.value) > payment.availableRefundAmount?.amount;
  const amountTooSmall =
    currentPayment?.value && Number(currentPayment.value) < 0;

  const formErrors = getFormErrors(["paymentsToRefund"], errors);
  const isError =
    !!formErrors.paymentsToRefund || amountTooSmall || amountTooBig;

  const getHintText = (): string => {
    if (formErrors.paymentsToRefund) {
      return getOrderErrorMessage(formErrors.paymentsToRefund, intl);
    }
    if (amountTooSmall) {
      return intl.formatMessage(messages.amountTooSmall);
    }
    if (amountTooBig) {
      return intl.formatMessage(messages.amountTooBig);
    }
    return "";
  };

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
      hint={getHintText()}
    />
  );
};

export default RefundAmountInput;
