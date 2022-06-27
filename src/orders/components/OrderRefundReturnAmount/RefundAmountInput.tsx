import { IMoney } from "@saleor/components/Money";
import PriceField from "@saleor/components/PriceField";
import { OrderErrorFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(1, 0),
    },
    maxRefundRow: {
      fontWeight: 600,
    },
    priceField: {
      marginTop: theme.spacing(2),
    },
    refundButton: {
      marginTop: theme.spacing(2),
    },
    refundCaution: {
      marginTop: theme.spacing(1),
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%",
    },
    textRight: {
      textAlign: "right",
    },
  }),
  { name: "OrderRefundAmount" },
);

interface RefundAmountInputProps {
  data: OrderRefundFormData;
  maxRefund: IMoney;
  currencySymbol: string;
  amountTooSmall: boolean;
  amountTooBig: boolean;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  amountTooBig: {
    id: "fbH51z",
    defaultMessage: "Amount cannot be bigger than max refund",
    description: "Amount error message",
  },
  amountTooSmall: {
    id: "IKvOK+",
    defaultMessage: "Amount must be bigger than 0",
    description: "Amount error message",
  },
  label: {
    id: "lrq8O6",
    defaultMessage: "Amount",
    description: "order refund amount, input label",
  },
});

const RefundAmountInput: React.FC<RefundAmountInputProps> = props => {
  const {
    data,
    maxRefund,
    amountTooSmall,
    amountTooBig,
    currencySymbol,
    disabled,
    errors,
    onChange,
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const formErrors = getFormErrors(["amount"], errors);

  const isError = !!formErrors.amount || amountTooSmall || amountTooBig;

  return (
    <PriceField
      disabled={disabled}
      onChange={onChange}
      currencySymbol={currencySymbol}
      name={"amount" as keyof FormData}
      value={data.amount}
      label={intl.formatMessage(messages.label)}
      className={classes.priceField}
      InputProps={{ inputProps: { max: maxRefund?.amount } }}
      inputProps={{
        "data-test-id": "amountInput",
        max: maxRefund?.amount,
      }}
      error={isError}
      hint={
        getOrderErrorMessage(formErrors.amount, intl) ||
        (amountTooSmall && intl.formatMessage(messages.amountTooSmall)) ||
        (amountTooBig && intl.formatMessage(messages.amountTooBig))
      }
    />
  );
};

export default RefundAmountInput;
