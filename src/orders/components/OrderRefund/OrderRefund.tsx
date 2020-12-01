import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  {
    cartContent: { paddingBottom: 0 }
  },
  { name: "OrderRefund" }
);

interface OrderRefundProps {
  data: OrderRefundFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  refundMiscellaneous: {
    defaultMessage: "Miscellaneous Refund",
    description: "refund type"
  },
  refundProducts: {
    defaultMessage: "Refund Products",
    description: "refund type"
  }
});

const OrderRefund: React.FC<OrderRefundProps> = props => {
  const { data, disabled, onChange } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refund Order",
          description: "section header"
        })}
      />
      <CardContent className={classes.cartContent}>
        <RadioGroupField
          choices={[
            {
              label: intl.formatMessage(messages.refundProducts),
              value: OrderRefundType.PRODUCTS
            },
            {
              label: intl.formatMessage(messages.refundMiscellaneous),
              value: OrderRefundType.MISCELLANEOUS
            }
          ]}
          disabled={disabled}
          name={"type" as keyof FormData}
          value={data.type}
          onChange={onChange}
          variant="inline"
        />
      </CardContent>
    </Card>
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
