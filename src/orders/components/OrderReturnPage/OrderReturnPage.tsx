// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import OrderAmount from "../OrderRefundReturnAmount";
import { getReturnProductsAmountValues } from "../OrderRefundReturnAmount/utils";
import { SubmitCard } from "./components";
import OrderRefundForm, { OrderRefundSubmitData } from "./form";
import { orderReturnMessages } from "./messages";
import ItemsCard from "./OrderReturnRefundItemsCard/ReturnItemsCard";
import {
  getFulfilledFulfillemnts,
  getParsedLines,
  getUnfulfilledLines,
  getWaitingFulfillments,
} from "./utils";

export interface OrderReturnPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
  errors?: OrderErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
  submitStatus: ConfirmButtonTransitionState;
}

const OrderRefundPage: React.FC<OrderReturnPageProps> = props => {
  const { order, loading, errors = [], onSubmit, submitStatus } = props;

  const intl = useIntl();
  return (
    <OrderRefundForm order={order} onSubmit={onSubmit}>
      {({ data, handlers, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav
            href={orderUrl(order?.id)}
            title={intl.formatMessage(orderReturnMessages.pageTitle, {
              orderNumber: order?.number,
            })}
          />
          <DetailPageLayout.Content>
            {!!data.unfulfilledItemsQuantities.length && (
              <>
                <ItemsCard
                  errors={errors}
                  order={order}
                  lines={getUnfulfilledLines(order as OrderDetailsFragment)}
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
              getWaitingFulfillments(order as OrderDetailsFragment),
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
              getFulfilledFulfillemnts(order as OrderDetailsFragment),
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
            {orderHasTransactions(order) ? (
              <SubmitCard
                disabled={isSaveDisabled}
                onSubmit={submit}
                submitStatus={submitStatus}
              />
            ) : (
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
            )}
          </DetailPageLayout.RightSidebar>
        </DetailPageLayout>
      )}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
