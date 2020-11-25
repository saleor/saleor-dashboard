import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import { useIntl } from "react-intl";

import OrderRefund from "../OrderRefund";
import OrderRefundAmount from "../OrderRefundAmount";
import OrderRefundForm, {
  OrderRefundSubmitData,
  OrderRefundType
} from "./form";

export interface OrderRefundPageProps {
  order: OrderRefundData_order;
  defaultType?: OrderRefundType;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onBack: () => void;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderRefundPageProps> = props => {
  const {
    order,
    defaultType = OrderRefundType.PRODUCTS,
    disabled,
    errors = [],
    onBack,
    onSubmit
  } = props;

  const intl = useIntl();

  return (
    <OrderRefundForm
      order={order}
      defaultType={defaultType}
      onSubmit={onSubmit}
    >
      {({ data, handlers, change, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {order?.number
              ? intl.formatMessage(
                  {
                    defaultMessage: "Order #{orderNumber}",
                    description: "page header with order number"
                  },
                  {
                    orderNumber: order.number
                  }
                )
              : intl.formatMessage({
                  defaultMessage: "Order",
                  description: "page header"
                })}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage(
              {
                defaultMessage: "Order no. {orderNumber} - Refund",
                description: "page header"
              },
              {
                orderNumber: order?.number
              }
            )}
          />
          <Grid>
            <div>
              <OrderRefund
                order={order}
                data={data}
                disabled={disabled}
                onChange={change}
                onRefundedProductQuantityChange={
                  handlers.changeRefundedProductQuantity
                }
                onSetMaximalQuantities={
                  handlers.setMaximalRefundedProductQuantities
                }
              />
            </div>
            <div>
              <OrderRefundAmount
                data={data}
                order={order}
                disabled={disabled}
                errors={errors}
                onChange={change}
                onRefund={submit}
              />
            </div>
          </Grid>
        </Container>
      )}
    </OrderRefundForm>
  );
};
OrderRefundPage.displayName = "OrderRefundPage";
export default OrderRefundPage;
