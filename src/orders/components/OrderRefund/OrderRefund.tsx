import { DashboardCard } from "@dashboard/components/Card";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import {} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  {
    cartContent: { paddingBottom: 0 },
  },
  { name: "OrderRefund" },
);

interface OrderRefundProps {
  data: OrderRefundFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  refundMiscellaneous: {
    id: "2V6eD8",
    defaultMessage: "Miscellaneous refund",
    description: "refund type",
  },
  refundProducts: {
    id: "VOjJWA",
    defaultMessage: "Refund products",
    description: "refund type",
  },
});
const OrderRefund: React.FC<OrderRefundProps> = props => {
  const { data, disabled, onChange } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "bqAJCT",
            defaultMessage: "Refund Order",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.cartContent}>
        <RadioGroupField
          choices={[
            {
              label: intl.formatMessage(messages.refundProducts),
              value: OrderRefundType.PRODUCTS,
            },
            {
              label: intl.formatMessage(messages.refundMiscellaneous),
              value: OrderRefundType.MISCELLANEOUS,
            },
          ]}
          disabled={disabled}
          name={"type" as keyof FormData}
          value={data.type}
          onChange={onChange}
          variant="inline"
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
