import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { renderCollection } from "@saleor/misc";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import { useIntl } from "react-intl";

import OrderRefund from "../OrderRefund";
import OrderRefundAmount from "../OrderRefundAmount";
import OrderRefundFulfilledProducts from "../OrderRefundFulfilledProducts";
import OrderRefundProducts from "../OrderRefundProducts";
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

  const unfulfilledLines = order?.lines.filter(
    line => line.quantity !== line.quantityFulfilled
  );

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
              <OrderRefund data={data} disabled={disabled} onChange={change} />
              {data.type === OrderRefundType.PRODUCTS && (
                <>
                  {unfulfilledLines?.length > 0 && (
                    <>
                      <CardSpacer />
                      <OrderRefundProducts
                        title={intl.formatMessage({
                          defaultMessage: "Unfulfilled Products",
                          description: "section header"
                        })}
                        unfulfilledLines={unfulfilledLines}
                        data={data}
                        disabled={disabled}
                        onRefundedProductQuantityChange={
                          handlers.changeRefundedProductQuantity
                        }
                        onSetMaximalQuantities={
                          handlers.setMaximalRefundedProductQuantities
                        }
                      />
                    </>
                  )}
                  {renderCollection(order?.fulfillments, fulfillment => (
                    <React.Fragment key={fulfillment?.id}>
                      <CardSpacer />
                      <OrderRefundFulfilledProducts
                        title={intl.formatMessage(
                          {
                            defaultMessage: "Fulfillment {warehouse}",
                            description: "section header"
                          },
                          {
                            warehouse: fulfillment?.warehouse?.name
                          }
                        )}
                        fulfillemnt={fulfillment}
                        data={data}
                        disabled={disabled}
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
                  ))}
                </>
              )}
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
