// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardMenu from "@dashboard/components/CardMenu";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataIdSchema } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import {
  extensionMountPoints,
  mapToMenuItemsForOrderDetails,
  useExtensions,
} from "@dashboard/extensions/hooks/useExtensions";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  OrderErrorFragment,
  OrderNoteUpdateMutation,
  OrderStatus,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { defaultGraphiQLQuery } from "@dashboard/orders/queries";
import { orderListUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, maybe } from "../../../misc";
import OrderChannelSectionCard from "../OrderChannelSectionCard";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import OrderFulfilledProductsCard from "../OrderFulfilledProductsCard";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderInvoiceList from "../OrderInvoiceList";
import { OrderPaymentOrTransaction } from "../OrderPaymentOrTransaction/OrderPaymentOrTransaction";
import OrderUnfulfilledProductsCard from "../OrderUnfulfilledProductsCard";
import { messages } from "./messages";
import Title from "./Title";
import {
  createMetadataHandler,
  createOrderMetadataIdSchema,
  filteredConditionalItems,
  hasAnyItemsReplaceable,
} from "./utils";

/**
 * @interface OrderDetailsPageProps
 * @property {OrderDetailsFragment | OrderDetailsFragment} order - 要显示的订单。
 * @property {OrderDetailsQuery["shop"]} shop - 商店数据。
 * @property {Array<{ id: string; name: string; }>} [shippingMethods] - 可用的送货方式。
 * @property {boolean} loading - 页面是否正在加载。
 * @property {ConfirmButtonTransitionState} saveButtonBarState - 保存按钮的状态。
 * @property {OrderErrorFragment[]} errors - 要显示的错误。
 * @property {() => void} [onOrderLineAdd] - 添加新订单行的回调。
 * @property {(id: string, data: OrderDraftDetailsProductsFormData) => void} [onOrderLineChange] - 更改订单行的回调。
 * @property {(id: string) => void} [onOrderLineRemove] - 删除订单行的回调。
 * @property {() => void} [onShippingMethodEdit] - 编辑送货方式的回调。
 * @property {() => any} onBillingAddressEdit - 编辑账单地址的回调。
 * @property {(id:string) => any} onFulfillmentApprove - 批准履行的回调。
 * @property {(id: string) => any} onFulfillmentCancel - 取消履行的回调。
 * @property {(id: string) => void} onShowMetadata - 显示元数据的回调。
 * @property {(id: string) => any} onFulfillmentTrackingNumberUpdate - 更新履行的跟踪号的回调。
 * @property {() => any} onOrderFulfill - 履行订单的回调。
 * @property {(id: string) => any} [onProductClick] - 单击产品的回调。
 * @property {() => any} onPaymentCapture - 捕获付款的回调。
 * @property {() => any} onMarkAsPaid - 将付款标记为已支付的回调。
 * @property {() => any} onPaymentRefund - 退款的回调。
 * @property {() => any} onPaymentVoid - 作废付款的回调。
 * @property {() => any} onShippingAddressEdit - 编辑送货地址的回调。
 * @property {() => any} onOrderCancel - 取消订单的回调。
 * @property {(data: HistoryFormData) => any} onNoteAdd - 向订单添加备注的回调。
 * @property {(id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>} onNoteUpdate - 更新备注的回调。
 * @property {boolean} onNoteUpdateLoading - 备注更新是否正在加载。
 * @property {() => any} onProfileView - 查看客户资料的回调。
 * @property {() => any} onOrderReturn - 退货的回调。
 * @property {(invoiceId: string) => any} onInvoiceClick - 单击发票的回调。
 * @property {() => any} onInvoiceGenerate - 生成发票的回调。
 * @property {(invoiceId: string) => any} onInvoiceSend - 发送发票的回调。
 * @property {(transactionId: string, actionType: TransactionActionEnum) => any} onTransactionAction - 执行交易操作的回调。
 * @property {() => any} onAddManualTransaction - 添加手动交易的回调。
 * @property {() => void} onRefundAdd - 添加退款的回调。
 * @property {(data: MetadataIdSchema) => SubmitPromise} onSubmit - 提交表单的回调。
 *
 * OrderDetailsPage 组件的属性。
 */
export interface OrderDetailsPageProps {
  order: OrderDetailsFragment | OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (id: string, data: OrderDraftDetailsProductsFormData) => void;
  onOrderLineRemove?: (id: string) => void;
  onShippingMethodEdit?: () => void;
  onBillingAddressEdit: () => any;
  onFulfillmentApprove: (id: string) => any;
  onFulfillmentCancel: (id: string) => any;
  onShowMetadata: (id: string) => void;
  onFulfillmentTrackingNumberUpdate: (id: string) => any;
  onOrderFulfill: () => any;
  onProductClick?: (id: string) => any;
  onPaymentCapture: () => any;
  onMarkAsPaid: () => any;
  onPaymentRefund: () => any;
  onPaymentVoid: () => any;
  onShippingAddressEdit: () => any;
  onOrderCancel: () => any;
  onNoteAdd: (data: HistoryFormData) => any;
  onNoteUpdate: (id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>;
  onNoteUpdateLoading: boolean;
  onProfileView: () => any;
  onOrderReturn: () => any;
  onInvoiceClick: (invoiceId: string) => any;
  onInvoiceGenerate: () => any;
  onInvoiceSend: (invoiceId: string) => any;
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => any;
  onAddManualTransaction: () => any;
  onRefundAdd: () => void;
  onSubmit: (data: MetadataIdSchema) => SubmitPromise;
}

/**
 * OrderDetailsPage 组件，用于显示订单的详细信息。
 *
 * 此组件负责呈现有关订单的所有信息，
 * 包括其产品、客户、付款和历史记录。它还提供
 * 用于管理订单的操作，例如履行、取消和退款。
 *
 * @param {OrderDetailsPageProps} props - OrderDetailsPage 组件的属性。
 * @returns {React.ReactElement} 一个显示订单详细信息的 React 元素。
 */
const OrderDetailsPage: React.FC<OrderDetailsPageProps> = props => {
  const {
    loading,
    order,
    shop,
    saveButtonBarState,
    errors,
    onBillingAddressEdit,
    onFulfillmentApprove,
    onFulfillmentCancel,
    onFulfillmentTrackingNumberUpdate,
    onNoteAdd,
    onNoteUpdate,
    onNoteUpdateLoading,
    onOrderCancel,
    onOrderFulfill,
    onPaymentCapture,
    onPaymentRefund,
    onPaymentVoid,
    onShippingAddressEdit,
    onProfileView,
    onInvoiceClick,
    onInvoiceGenerate,
    onInvoiceSend,
    onOrderReturn,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingMethodEdit,
    onTransactionAction,
    onAddManualTransaction,
    onShowMetadata,
    onMarkAsPaid,
    onRefundAdd,
    onSubmit,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();
  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const notAllowedToFulfillUnpaid =
    shop?.fulfillmentAutoApprove && !shop?.fulfillmentAllowUnpaid && !order?.isPaid;
  const unfulfilled = (order?.lines || []).filter(line => line.quantityToFulfill > 0);
  const handleSubmit = async (data: MetadataIdSchema) => {
    const result = await onSubmit(data);

    return getMutationErrors(result);
  };
  const initial = createOrderMetadataIdSchema(order);
  const saveLabel = isOrderUnconfirmed
    ? { confirm: intl.formatMessage(messages.confirmOrder) }
    : undefined;
  const allowSave = () => {
    if (!isOrderUnconfirmed) {
      return loading;
    } else if (!order?.lines?.length) {
      return true;
    }

    return loading;
  };
  const selectCardMenuItems = filteredConditionalItems([
    {
      item: {
        label: intl.formatMessage(messages.cancelOrder),
        onSelect: onOrderCancel,
      },
      shouldExist: canCancel,
    },
    {
      item: {
        label: intl.formatMessage(messages.returnOrder),
        onSelect: onOrderReturn,
      },
      shouldExist: hasAnyItemsReplaceable(order),
    },
  ]);
  const { ORDER_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.ORDER_DETAILS);
  const extensionMenuItems = mapToMenuItemsForOrderDetails(ORDER_DETAILS_MORE_ACTIONS, order?.id);
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${order?.id}" }`);
    context.setDevModeVisibility(true);
  };

  const backLinkUrl = useBackLinkWithState({
    path: orderListUrl(),
  });

  return (
    <Form confirmLeave initial={initial} onSubmit={handleSubmit} mergeData={false}>
      {({ set, triggerChange, data, submit }) => {
        const handleChangeMetadata = createMetadataHandler(data, set, triggerChange);

        return (
          <DetailPageLayout>
            <TopNav href={backLinkUrl} title={<Title order={order} />}>
              <CardMenu
                menuItems={[
                  ...selectCardMenuItems,
                  ...extensionMenuItems,
                  {
                    label: intl.formatMessage(messages.openGraphiQL),
                    onSelect: openPlaygroundURL,
                    testId: "graphiql-redirect",
                  },
                ]}
              />
            </TopNav>

            <DetailPageLayout.Content data-test-id="order-fulfillment">
              {!isOrderUnconfirmed ? (
                <OrderUnfulfilledProductsCard
                  showFulfillmentAction={canFulfill}
                  notAllowedToFulfillUnpaid={notAllowedToFulfillUnpaid}
                  lines={unfulfilled}
                  onFulfill={onOrderFulfill}
                  loading={loading}
                  onShowMetadata={onShowMetadata}
                />
              ) : (
                <>
                  <OrderDraftDetails
                    order={order}
                    errors={errors}
                    loading={loading}
                    onShowMetadata={onShowMetadata}
                    onOrderLineAdd={onOrderLineAdd}
                    onOrderLineChange={onOrderLineChange}
                    onOrderLineRemove={onOrderLineRemove}
                    onShippingMethodEdit={onShippingMethodEdit}
                  />
                  <CardSpacer />
                </>
              )}
              {order?.fulfillments?.map(fulfillment => (
                <OrderFulfilledProductsCard
                  dataTestId="fulfilled-order-section"
                  key={fulfillment.id}
                  fulfillment={fulfillment}
                  fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
                  order={order}
                  onShowMetadata={onShowMetadata}
                  onOrderFulfillmentCancel={() => onFulfillmentCancel(fulfillment.id)}
                  onTrackingCodeAdd={() => onFulfillmentTrackingNumberUpdate(fulfillment.id)}
                  onOrderFulfillmentApprove={() => onFulfillmentApprove(fulfillment.id)}
                >
                  <Metadata
                    isLoading={loading}
                    data={data[fulfillment.id]}
                    onChange={x => handleChangeMetadata(x, fulfillment.id)}
                  />
                </OrderFulfilledProductsCard>
              ))}
              <OrderPaymentOrTransaction
                order={order}
                shop={shop}
                onTransactionAction={onTransactionAction}
                onPaymentCapture={onPaymentCapture}
                onPaymentVoid={onPaymentVoid}
                onPaymentRefund={onPaymentRefund}
                onMarkAsPaid={onMarkAsPaid}
                onAddManualTransaction={onAddManualTransaction}
                onRefundAdd={onRefundAdd}
              />
              <Metadata
                isLoading={loading}
                data={data[order?.id]}
                onChange={x => handleChangeMetadata(x, order?.id)}
              />
              <OrderHistory
                history={order?.events}
                onNoteUpdateLoading={onNoteUpdateLoading}
                orderCurrency={order?.total?.gross.currency}
                onNoteAdd={onNoteAdd}
                onNoteUpdate={onNoteUpdate}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <OrderCustomer
                canEditAddresses={canEditAddresses}
                canEditCustomer={false}
                order={order}
                errors={errors}
                onBillingAddressEdit={onBillingAddressEdit}
                onShippingAddressEdit={onShippingAddressEdit}
                onProfileView={onProfileView}
              />
              <CardSpacer />
              <OrderChannelSectionCard channel={order?.channel} />
              <CardSpacer />
              {!isOrderUnconfirmed && (
                <>
                  <OrderInvoiceList
                    invoices={order?.invoices}
                    onInvoiceClick={onInvoiceClick}
                    onInvoiceGenerate={onInvoiceGenerate}
                    onInvoiceSend={onInvoiceSend}
                  />
                  <CardSpacer />
                </>
              )}
              <OrderCustomerNote note={maybe(() => order.customerNote)} />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(orderListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={allowSave()}
              >
                {saveLabel?.confirm}
              </Savebar.ConfirmButton>
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
