// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderGrantRefundCreateErrorFragment,
  TransactionRequestRefundForGrantedRefundErrorFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import { Fragment } from "react";
import { useIntl } from "react-intl";

import { calculateCanRefundShipping } from "../OrderGrantRefundPage/utils";
import { TransactionSubmitCard } from "./components";
import { PaymentSubmitCard } from "./components/PaymentSubmitCard";
import { getReturnProductsAmountValues } from "./components/PaymentSubmitCard/utils";
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
  order: OrderDetailsFragment | undefined | null;
  loading: boolean;
  returnErrors?: OrderErrorFragment[];
  grantRefundErrors?: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors?: TransactionRequestRefundForGrantedRefundErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
  submitStatus: ConfirmButtonTransitionState;
}

const OrderRefundPage = (props: OrderReturnPageProps) => {
  const {
    order,
    loading,
    returnErrors = [],
    grantRefundErrors = [],
    sendRefundErrors = [],
    onSubmit,
    submitStatus,
  } = props;
  const canRefundShipping = calculateCanRefundShipping(null, order?.grantedRefunds);
  const intl = useIntl();

  return (
    <OrderRefundForm order={order} onSubmit={onSubmit}>
      {({ data, handlers, change, submit, isSaveDisabled, isAmountDirty }) => (
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
                  errors={returnErrors}
                  order={order}
                  lines={getUnfulfilledLines(order as OrderDetailsFragment)}
                  itemsQuantities={data.unfulfilledItemsQuantities}
                  itemsSelections={data.itemsToBeReplaced}
                  onChangeQuantity={handlers.changeUnfulfiledItemsQuantity}
                  onSetMaxQuantity={handlers.handleSetMaximalUnfulfiledItemsQuantities}
                  onChangeSelected={handlers.changeItemsToBeReplaced}
                />
                <CardSpacer />
              </>
            )}
            {renderCollection(
              getWaitingFulfillments(order as OrderDetailsFragment),
              ({ id, lines }) => (
                <Fragment key={id}>
                  <ItemsCard
                    errors={returnErrors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.waitingItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeWaitingItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(id)}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                  />
                  <CardSpacer />
                </Fragment>
              ),
            )}
            {renderCollection(
              getFulfilledFulfillemnts(order as OrderDetailsFragment),
              ({ id, lines }) => (
                <Fragment key={id}>
                  <ItemsCard
                    errors={returnErrors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.fulfilledItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeFulfiledItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(id)}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                  />
                  <CardSpacer />
                </Fragment>
              ),
            )}
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            {orderHasTransactions(order) ? (
              <TransactionSubmitCard
                transactions={order.transactions}
                grantRefundErrors={grantRefundErrors}
                sendRefundErrors={sendRefundErrors}
                customRefundValue={data.amount}
                autoGrantRefund={data.autoGrantRefund}
                autoSendRefund={data.autoSendRefund}
                refundShipmentCosts={data.refundShipmentCosts}
                canRefundShipping={canRefundShipping}
                shippingCosts={order?.shippingPrice?.gross}
                amountData={getReturnProductsAmountValues(order, data)}
                onChange={change}
                disabled={isSaveDisabled}
                onSubmit={submit}
                submitStatus={submitStatus}
                onAmountChange={handlers.handleAmountChange}
                isAmountDirty={isAmountDirty}
              />
            ) : (
              <PaymentSubmitCard
                allowNoRefund
                isReturn
                amountData={getReturnProductsAmountValues(order, data)}
                data={data}
                order={order}
                disableSubmitButton={isSaveDisabled}
                disabled={loading}
                errors={returnErrors}
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
