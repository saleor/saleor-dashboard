import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import OrderRefundAmount from "../OrderRefundAmount";
import OrderRefundFulfilledProducts from "../OrderRefundFulfilledProducts";
import OrderRefundUnfulfilledProducts from "../OrderRefundUnfulfilledProducts";
import OrderRefundForm, {
  OrderRefundSubmitData,
  OrderRefundType
} from "./form";

const messages = defineMessages({
  appTitle: {
    defaultMessage: "Order #{orderNumber}",
    description: "page header with order number"
  },
  pageTitle: {
    defaultMessage: "Order no. {orderNumber} - Replace/Return",
    description: "page header"
  }
});

export interface OrderRefundPageProps {
  order: OrderDetails_order;
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
          {console.log("DATA", data)}
          <AppHeader onBack={onBack}>
            {intl.formatMessage(messages.appTitle, {
              orderNumber: order?.number
            })}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage(messages.pageTitle, {
              orderNumber: order?.number
            })}
          />
          <Grid>
            <OrderRefundUnfulfilledProducts
              order={order}
              data={data}
              onRefundedProductQuantityChange={
                handlers.changeRefundedProductQuantity
              }
              onSetMaximalQuantities={
                handlers.setMaximalRefundedProductQuantities
              }
              // disabled={disabled}
            />
            {/* {renderCollection(
                    getFulfilledFulfillemnts(order),
                    fulfillment => (
                      <React.Fragment key={fulfillment?.id}>
                        <CardSpacer />
                        <OrderRefundFulfilledProducts
                          fulfillment={fulfillment}
                          data={data}
                          disabled={disabled}
                          orderNumber={order?.number}
                          onRefundedProductQuantityChange={
                            handlers.changeRefundedFulfilledProductQuantity
                          }
                          onSetMaximalQuantities={() =>
                            handlers.setMaximalRefundedFulfilledProductQuantities(
                              fulfillment?.id
                            )
                          }
                        />
                      </React.Fragment>
                    )
                  )} */}
            <OrderRefundAmount
              data={data}
              order={order}
              disabled={disabled}
              errors={errors}
              onChange={change}
              onRefund={submit}
            />
          </Grid>
        </Container>
      )}
    </OrderRefundForm>
  );
};
OrderRefundPage.displayName = "OrderRefundPage";
export default OrderRefundPage;
