import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import OrderAmount from "../OrderRefundReturnAmount";
import { getReturnProductsAmountValues } from "../OrderRefundReturnAmount/utils";
import OrderRefundForm, { OrderRefundSubmitData } from "./form";
import ItemsCard from "./OrderReturnRefundItemsCard/ReturnItemsCard";
import {
  getFulfilledFulfillemnts,
  getParsedLines,
  getUnfulfilledLines,
  getWaitingFulfillments,
} from "./utils";

const messages = defineMessages({
  appTitle: {
    id: "rVIlBs",
    defaultMessage: "Order #{orderNumber}",
    description: "page header with order number",
  },
  pageTitle: {
    id: "BBIQxQ",
    defaultMessage: "Order no. {orderNumber} - Replace/Return",
    description: "page header",
  },
});

export interface OrderReturnPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
  errors?: OrderErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderReturnPageProps> = props => {
  const { order, loading, errors = [], onSubmit } = props;

  const intl = useIntl();
  return (
    <OrderRefundForm order={order} onSubmit={onSubmit}>
      {({ data, handlers, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav
            href={orderUrl(order?.id)}
            title={intl.formatMessage(messages.pageTitle, {
              orderNumber: order?.number,
            })}
          />
          <DetailPageLayout.Content>
            {!!data.unfulfilledItemsQuantities.length && (
              <>
                <ItemsCard
                  errors={errors}
                  order={order}
                  lines={getUnfulfilledLines(order)}
                  itemsQuantities={data.unfulfilledItemsQuantities}
                  itemsSelections={data.itemsToBeReplaced}
                  onChangeQuantity={handlers.changeUnfulfiledItemsQuantity}
                  onSetMaxQuantity={
                    handlers.handleSetMaximalUnfulfiledItemsQuantities
                  }
                  onChangeSelected={handlers.changeItemsToBeReplaced}
                />
                <CardSpacer />
              </>
            )}
            {renderCollection(
              getWaitingFulfillments(order),
              ({ id, lines }) => (
                <React.Fragment key={id}>
                  <ItemsCard
                    errors={errors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.waitingItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeWaitingItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                      id,
                    )}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                  />
                  <CardSpacer />
                </React.Fragment>
              ),
            )}
            {renderCollection(
              getFulfilledFulfillemnts(order),
              ({ id, lines }) => (
                <React.Fragment key={id}>
                  <ItemsCard
                    errors={errors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.fulfilledItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeFulfiledItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                      id,
                    )}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                  />
                  <CardSpacer />
                </React.Fragment>
              ),
            )}
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <OrderAmount
              allowNoRefund
              isReturn
              amountData={getReturnProductsAmountValues(order, data)}
              data={data}
              order={order}
              disableSubmitButton={isSaveDisabled}
              disabled={loading}
              errors={errors}
              onChange={change}
              onRefund={submit}
            />
          </DetailPageLayout.RightSidebar>
        </DetailPageLayout>
      )}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
