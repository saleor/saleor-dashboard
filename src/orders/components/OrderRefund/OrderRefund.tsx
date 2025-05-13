import { DashboardCard } from "@dashboard/components/Card";
import { SimpleRadioGroupField } from "@dashboard/components/SimpleRadioGroupField";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

interface OrderRefundProps {
  data: OrderRefundFormData;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
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
      <DashboardCard.Content paddingBottom={0}>
        <SimpleRadioGroupField
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
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
