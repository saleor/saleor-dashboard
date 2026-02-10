// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderGrantRefundCreateErrorFragment,
  PermissionEnum,
  TransactionRequestRefundForGrantedRefundErrorFragment,
  useModelsOfTypeQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { pageListUrl } from "@dashboard/modeling/urls";
import { refundReasonSelectHelperMessages } from "@dashboard/orders/messages";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { Box, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Fragment, useMemo } from "react";
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

interface OrderReturnPageProps {
  order: OrderDetailsFragment | undefined | null;
  loading: boolean;
  returnErrors?: OrderErrorFragment[];
  grantRefundErrors?: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors?: TransactionRequestRefundForGrantedRefundErrorFragment[];
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
  submitStatus: ConfirmButtonTransitionState;
  modelForRefundReasonRefId?: string | null;
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
    modelForRefundReasonRefId,
  } = props;
  const canRefundShipping = calculateCanRefundShipping(null, order?.grantedRefunds);
  const intl = useIntl();
  const permissions = useUserPermissions();
  const canManageSettings = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_SETTINGS]);

  const { data: modelsData, loading: modelsLoading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: modelForRefundReasonRefId ?? "",
    },
    skip: !modelForRefundReasonRefId,
  });

  const reasonRefOptions = useMemo(() => {
    const options =
      modelsData?.pages?.edges.map(model => ({
        value: model.node.id,
        label: model.node.title,
      })) ?? [];

    return [
      {
        value: "",
        label: intl.formatMessage({ defaultMessage: "Select a reason type", id: "vSLaZ7" }),
      },
      ...options,
    ];
  }, [modelsData, intl]);

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
              <>
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
                  onSubmit={submit}
                  submitStatus={submitStatus}
                  onAmountChange={handlers.handleAmountChange}
                  isAmountDirty={isAmountDirty}
                />
                <Box marginTop={6}>
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage({
                          defaultMessage: "Refund reason",
                          id: "yUvR0h",
                        })}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      {modelsLoading ? (
                        <Skeleton />
                      ) : (
                        <Select
                          disabled={!modelForRefundReasonRefId || loading}
                          options={reasonRefOptions}
                          value={data.reasonReference}
                          name="reasonReference"
                          onChange={value =>
                            change({
                              target: {
                                name: "reasonReference",
                                value: value as string,
                              },
                            })
                          }
                        />
                      )}
                      <Box marginTop={2}>
                        {canManageSettings && modelForRefundReasonRefId && (
                          <Link href={pageListUrl()}>
                            <Text color="inherit" size={2}>
                              {intl.formatMessage(refundReasonSelectHelperMessages.manageReasons)}
                            </Text>
                          </Link>
                        )}
                        {canManageSettings && !modelForRefundReasonRefId && (
                          <Link href={refundsSettingsPath}>
                            <Text color="inherit" size={2}>
                              {intl.formatMessage(
                                refundReasonSelectHelperMessages.enableReasonsInSettings,
                              )}
                            </Text>
                          </Link>
                        )}
                        {!canManageSettings && (
                          <Text color="default2" size={2}>
                            {intl.formatMessage(refundReasonSelectHelperMessages.noPermissionsHint)}
                          </Text>
                        )}
                      </Box>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
              </>
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
                loading={loading}
              />
            )}
          </DetailPageLayout.RightSidebar>
        </DetailPageLayout>
      )}
    </OrderRefundForm>
  );
};

export default OrderRefundPage;
