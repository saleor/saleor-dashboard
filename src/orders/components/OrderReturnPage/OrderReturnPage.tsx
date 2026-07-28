// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  type OrderDetailsFragment,
  type OrderErrorFragment,
  useReturnSettingsQuery,
} from "@dashboard/graphql";
import { type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { orderReturnUrl, orderUrl } from "@dashboard/orders/urls";
import { getOrderLineDisplayName } from "@dashboard/orders/utils/data";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Fragment, type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { OrderReturnReasonCard } from "./components/OrderReturnReasonCard/OrderReturnReasonCard";
import OrderRefundForm, { type OrderRefundSubmitData, type OrderReturnFormData } from "./form";
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

/** Form state the mode-specific submit card needs; everything else it already owns. */
export interface OrderReturnSubmitCardProps {
  data: OrderReturnFormData;
  change: FormChange;
  onAmountChange: (value: number) => void;
  isAmountDirty: boolean;
  isSaveDisabled: boolean;
  /**
   * Gated on the return reason. Pass `true` when the card's own validation
   * failed, so both error states surface together and nothing is submitted.
   */
  submit: (cardInvalid?: boolean) => void;
}

interface OrderReturnPageProps {
  order: OrderDetailsFragment | undefined | null;
  loading: boolean;
  returnErrors?: OrderErrorFragment[];
  prefilledOrderLineId?: string;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
  /**
   * Payment-mode owned sidebar. The page never decides which submit card to
   * show — the concrete Legacy/Transaction return view supplies it resolved.
   */
  submitCard: (props: OrderReturnSubmitCardProps) => ReactNode;
}

const OrderRefundPage = (props: OrderReturnPageProps) => {
  const { order, loading, returnErrors = [], prefilledOrderLineId, onSubmit, submitCard } = props;
  const intl = useIntl();
  const { data: returnSettingsData } = useReturnSettingsQuery();
  const reasonReferenceTypeId = returnSettingsData?.returnSettings.reasonReferenceType?.id ?? "";
  // When a return reason type is configured, selecting a reason is required.
  // Track whether a submit was attempted while the required reason was missing.
  const [showReasonError, setShowReasonError] = useState(false);
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
        const handleValidatedSubmit = (cardInvalid?: boolean) => {
          setShowReasonError(isReasonMissing);

          if (isReasonMissing || cardInvalid) {
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
              {submitCard({
                data,
                change,
                onAmountChange: handlers.handleAmountChange,
                isAmountDirty,
                isSaveDisabled,
                submit: handleValidatedSubmit,
              })}
            </DetailPageLayout.RightSidebar>
          </DetailPageLayout>
        );
      }}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
