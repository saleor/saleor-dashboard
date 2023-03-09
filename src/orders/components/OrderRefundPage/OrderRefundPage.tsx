import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { FulfillmentStatus, OrderErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { OrderRefundData } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import OrderRefund from "../OrderRefund";
import OrderRefundFulfilledProducts from "../OrderRefundFulfilledProducts";
import OrderRefundAmount from "../OrderRefundReturnAmount";
import {
  getMiscellaneousAmountValues,
  getRefundProductsAmountValues,
} from "../OrderRefundReturnAmount/utils";
import OrderRefundUnfulfilledProducts from "../OrderRefundUnfulfilledProducts";
import OrderRefundForm, {
  OrderRefundSubmitData,
  OrderRefundType,
} from "./form";

export const refundFulfilledStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
];

export interface OrderRefundPageProps {
  order: OrderRefundData;
  defaultType?: OrderRefundType;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderRefundPageProps> = props => {
  const {
    order,
    defaultType = OrderRefundType.PRODUCTS,
    disabled,
    errors = [],
    onSubmit,
  } = props;

  const intl = useIntl();

  const unfulfilledLines = order?.lines.filter(
    line => line.quantityToFulfill > 0,
  );

  const fulfilledFulfillemnts =
    order?.fulfillments.filter(({ status }) =>
      refundFulfilledStatuses.includes(status),
    ) || [];

  return (
    <OrderRefundForm
      order={order}
      defaultType={defaultType}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, handlers, change, submit, isSaveDisabled }) => {
        const isProductRefund = data.type === OrderRefundType.PRODUCTS;

        return (
          <DetailPageLayout>
            <TopNav
              href={orderUrl(order?.id)}
              title={intl.formatMessage(
                {
                  id: "0krqBj",
                  defaultMessage: "Order no. {orderNumber} - Refund",
                  description: "page header",
                },
                {
                  orderNumber: order?.number,
                },
              )}
            />
            <DetailPageLayout.Content>
              <OrderRefund data={data} disabled={disabled} onChange={change} />
              {isProductRefund && (
                <>
                  {unfulfilledLines?.length > 0 && (
                    <>
                      <CardSpacer />
                      <OrderRefundUnfulfilledProducts
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
                  {renderCollection(fulfilledFulfillemnts, fulfillment => (
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
                            fulfillment?.id,
                          )
                        }
                      />
                    </React.Fragment>
                  ))}
                </>
              )}
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <OrderRefundAmount
                amountData={
                  isProductRefund
                    ? getRefundProductsAmountValues(order, data)
                    : getMiscellaneousAmountValues(order)
                }
                data={data}
                order={order}
                disabled={isSaveDisabled}
                errors={errors}
                onChange={change}
                onRefund={submit}
              />
            </DetailPageLayout.RightSidebar>
          </DetailPageLayout>
        );
      }}
    </OrderRefundForm>
  );
};
OrderRefundPage.displayName = "OrderRefundPage";
export default OrderRefundPage;
