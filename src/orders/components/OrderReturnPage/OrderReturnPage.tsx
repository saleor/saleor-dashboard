import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import { useFlags } from "@dashboard/hooks/useFlags";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import {
  OrderBothTypes,
  orderHasTransactions,
  OrderSharedType,
} from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  order: OrderBothTypes;
  loading: boolean;
  errors?: OrderErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
  submitStatus: ConfirmButtonTransitionState;
}

const OrderRefundPage: React.FC<OrderReturnPageProps> = props => {
  const { order, loading, errors = [], onSubmit, submitStatus } = props;

  const { orderTransactions } = useFlags(["orderTransactions"]);

  const intl = useIntl();
  return (
    <OrderRefundForm order={order} onSubmit={onSubmit}>
      {({ data, handlers, change, submit, isSaveDisabled }) => (
        <DetailedContent>
          <TopNav
            href={orderUrl(order?.id)}
            title={intl.formatMessage(orderReturnMessages.pageTitle, {
              orderNumber: order?.number,
            })}
          />
          <Content>
            {!!data.unfulfilledItemsQuantities.length && (
              <>
                <ItemsCard
                  errors={errors}
                  order={order}
                  lines={getUnfulfilledLines(order as OrderSharedType)}
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
              getWaitingFulfillments(order as OrderSharedType),
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
              getFulfilledFulfillemnts(order as OrderSharedType),
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
          </Content>
          <RightSidebar>
            {orderHasTransactions(order, orderTransactions.enabled) ? (
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
          </RightSidebar>
        </DetailedContent>
      )}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
