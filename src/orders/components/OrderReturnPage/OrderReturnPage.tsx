// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  type OrderDetailsFragment,
  type OrderErrorFragment,
  type OrderGrantRefundCreateErrorFragment,
  type TransactionRequestRefundForGrantedRefundErrorFragment,
  useRefundSettingsQuery,
  useReturnSettingsQuery,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderReturnUrl, orderUrl } from "@dashboard/orders/urls";
import { getOrderLineDisplayName } from "@dashboard/orders/utils/data";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { calculateCanRefundShipping } from "../OrderGrantRefundPage/utils";
import { TransactionSubmitCard } from "./components";
import { OrderReturnReasonCard } from "./components/OrderReturnReasonCard/OrderReturnReasonCard";
import { PaymentSubmitCard } from "./components/PaymentSubmitCard";
import { getReturnProductsAmountValues } from "./components/PaymentSubmitCard/utils";
import OrderRefundForm, { type OrderRefundSubmitData } from "./form";
import { orderReturnMessages } from "./messages";
import ItemsCard from "./OrderReturnRefundItemsCard/ReturnItemsCard";
import {
  filterFulfillmentsByOrderLineId,
  filterOrderLinesByOrderLineId,
  getFulfilledFulfillemnts,
  getParsedLines,
  getUnfulfilledLines,
  getWaitingFulfillments,
} from "./utils";

interface OrderReturnPageProps {
  order: OrderDetailsFragment | undefined | null;
  loading: boolean;
  returnErrors?: OrderErrorFragment[];
  grantRefundErrors?: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors?: TransactionRequestRefundForGrantedRefundErrorFragment[];
  prefilledOrderLineId?: string;
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
    prefilledOrderLineId,
    onSubmit,
    submitStatus,
  } = props;
  const canRefundShipping = calculateCanRefundShipping(null, order?.grantedRefunds);
  const intl = useIntl();
  const { data: returnSettingsData } = useReturnSettingsQuery();
  const reasonReferenceTypeId = returnSettingsData?.returnSettings.reasonReferenceType?.id ?? "";
  const { data: refundSettingsData } = useRefundSettingsQuery();
  const refundReasonReferenceTypeId =
    refundSettingsData?.refundSettings.reasonReferenceType?.id ?? "";
  // When a return reason type is configured, selecting a reason is required.
  // Track whether a submit was attempted while the required reason was missing.
  const [showReasonError, setShowReasonError] = useState(false);
  // Same for the refund reason when granting a refund during the return.
  const [showRefundReasonError, setShowRefundReasonError] = useState(false);
  const prefilledLine = prefilledOrderLineId
    ? order?.lines?.find(line => line.id === prefilledOrderLineId)
    : undefined;
  const prefilledProductName = prefilledLine ? getOrderLineDisplayName(prefilledLine) : "";
  const unfulfilledLines = filterOrderLinesByOrderLineId(
    getUnfulfilledLines(order),
    prefilledOrderLineId,
  );
  const waitingFulfillments = filterFulfillmentsByOrderLineId(
    getWaitingFulfillments(order as OrderDetailsFragment),
    prefilledOrderLineId,
  );
  const fulfilledFulfillments = filterFulfillmentsByOrderLineId(
    getFulfilledFulfillemnts(order as OrderDetailsFragment),
    prefilledOrderLineId,
  );

  return (
    <OrderRefundForm order={order} prefilledOrderLineId={prefilledOrderLineId} onSubmit={onSubmit}>
      {({ data, handlers, change, submit, isSaveDisabled, isAmountDirty }) => {
        const isReasonMissing = !!reasonReferenceTypeId && !data.reasonReference;
        const isRefundReasonMissing =
          data.autoGrantRefund && !!refundReasonReferenceTypeId && !data.refundReasonReference;
        const handleValidatedSubmit = () => {
          setShowReasonError(isReasonMissing);
          setShowRefundReasonError(isRefundReasonMissing);

          if (isReasonMissing || isRefundReasonMissing) {
            return;
          }

          return submit();
        };

        return (
          <DetailPageLayout>
            <TopNav
              href={orderUrl(order?.id)}
              title={intl.formatMessage(orderReturnMessages.pageTitle, {
                orderNumber: order?.number,
              })}
            />
            <DetailPageLayout.Content>
              {prefilledLine && (
                <Box
                  paddingX={6}
                  paddingY={3}
                  data-test-id="return-prefilled-line-hint"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={3}
                  flexWrap="wrap"
                >
                  <Text size={3} color="default2">
                    <FormattedMessage
                      {...orderReturnMessages.prefilledLineHint}
                      values={{ productName: prefilledProductName }}
                    />
                  </Text>
                  <Link to={orderReturnUrl(order?.id ?? "")}>
                    <Button variant="tertiary" size="small">
                      <FormattedMessage {...orderReturnMessages.showAllLines} />
                    </Button>
                  </Link>
                </Box>
              )}
              {unfulfilledLines.length > 0 && (
                <>
                  <ItemsCard
                    errors={returnErrors}
                    order={order}
                    lines={unfulfilledLines}
                    itemsQuantities={data.unfulfilledItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeUnfulfiledItemsQuantity}
                    onSetMaxQuantity={() =>
                      handlers.handleSetMaximalUnfulfiledItemsQuantities(prefilledOrderLineId)
                    }
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                    lineReasons={data.lineReasons}
                    onChangeLineReason={handlers.changeLineReason}
                    reasonReferenceTypeId={reasonReferenceTypeId}
                  />
                  <CardSpacer />
                </>
              )}
              {renderCollection(waitingFulfillments, ({ id, lines }) => (
                <Fragment key={id}>
                  <ItemsCard
                    errors={returnErrors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.waitingItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeWaitingItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                      id,
                      prefilledOrderLineId,
                    )}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                    lineReasons={data.lineReasons}
                    onChangeLineReason={handlers.changeLineReason}
                    reasonReferenceTypeId={reasonReferenceTypeId}
                  />
                  <CardSpacer />
                </Fragment>
              ))}
              {renderCollection(fulfilledFulfillments, ({ id, lines }) => (
                <Fragment key={id}>
                  <ItemsCard
                    errors={returnErrors}
                    order={order}
                    fulfilmentId={id}
                    lines={getParsedLines(lines)}
                    itemsQuantities={data.fulfilledItemsQuantities}
                    itemsSelections={data.itemsToBeReplaced}
                    onChangeQuantity={handlers.changeFulfiledItemsQuantity}
                    onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                      id,
                      prefilledOrderLineId,
                    )}
                    onChangeSelected={handlers.changeItemsToBeReplaced}
                    lineReasons={data.lineReasons}
                    onChangeLineReason={handlers.changeLineReason}
                    reasonReferenceTypeId={reasonReferenceTypeId}
                  />
                  <CardSpacer />
                </Fragment>
              ))}
              <OrderReturnReasonCard
                reason={data.reason}
                reasonReference={data.reasonReference}
                reasonReferenceTypeId={reasonReferenceTypeId}
                disabled={loading}
                error={showReasonError}
                onChangeReason={value => change({ target: { name: "reason", value } })}
                onChangeReasonReference={value => {
                  setShowReasonError(false);
                  change({ target: { name: "reasonReference", value } });
                }}
              />
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
                  transactionId={data.transactionId}
                  amountData={getReturnProductsAmountValues(order, data)}
                  onChange={change}
                  disabled={isSaveDisabled}
                  onSubmit={handleValidatedSubmit}
                  submitStatus={submitStatus}
                  onAmountChange={handlers.handleAmountChange}
                  isAmountDirty={isAmountDirty}
                  refundReason={data.refundReason}
                  refundReasonReference={data.refundReasonReference}
                  refundReasonReferenceTypeId={refundReasonReferenceTypeId}
                  refundReasonError={showRefundReasonError}
                  onClearRefundReasonError={() => setShowRefundReasonError(false)}
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
                  onRefund={handleValidatedSubmit}
                  loading={loading}
                />
              )}
            </DetailPageLayout.RightSidebar>
          </DetailPageLayout>
        );
      }}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
