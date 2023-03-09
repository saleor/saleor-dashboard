import {
  extensionMountPoints,
  mapToMenuItemsForOrderDetails,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardMenu from "@dashboard/components/CardMenu";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Metadata, { MetadataFormData } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { OrderDetailsFragment, OrderDetailsQuery } from "@dashboard/graphql";
import {
  OrderDetailsWithTransactionsFragment,
  OrderDetailsWithTransactionsQuery,
  OrderStatus,
  TransactionActionEnum,
} from "@dashboard/graphql/transactions";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { defaultGraphiQLQuery } from "@dashboard/orders/queries";
import { OrderErrorFragment, OrderSharedType } from "@dashboard/orders/types";
import { orderListUrl } from "@dashboard/orders/urls";
import { playgroundOpenHandler } from "@dashboard/utils/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
import { filteredConditionalItems, hasAnyItemsReplaceable } from "./utils";

export interface OrderDetailsPageProps {
  order: OrderDetailsFragment | OrderDetailsWithTransactionsFragment;
  shop: OrderDetailsQuery["shop"] | OrderDetailsWithTransactionsQuery["shop"];
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (
    id: string,
    data: OrderDraftDetailsProductsFormData,
  ) => void;
  onOrderLineRemove?: (id: string) => void;
  onShippingMethodEdit?: () => void;
  onBillingAddressEdit();
  onFulfillmentApprove(id: string);
  onFulfillmentCancel(id: string);
  onFulfillmentTrackingNumberUpdate(id: string);
  onOrderFulfill();
  onProductClick?(id: string);
  onPaymentCapture();
  onMarkAsPaid();
  onPaymentRefund();
  onPaymentVoid();
  onShippingAddressEdit();
  onOrderCancel();
  onNoteAdd(data: HistoryFormData);
  onProfileView();
  onOrderReturn();
  onInvoiceClick(invoiceId: string);
  onInvoiceGenerate();
  onInvoiceSend(invoiceId: string);
  onTransactionAction(transactionId: string, actionType: TransactionActionEnum);
  onAddManualTransaction();
  onSubmit(data: MetadataFormData): SubmitPromise;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = props => {
  const {
    disabled,
    order,
    shop,
    saveButtonBarState,
    errors,
    onBillingAddressEdit,
    onFulfillmentApprove,
    onFulfillmentCancel,
    onFulfillmentTrackingNumberUpdate,
    onNoteAdd,
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
    onMarkAsPaid,
    onSubmit,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
    resetMetadataChanged,
  } = useMetadataChangeTrigger();

  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const notAllowedToFulfillUnpaid =
    shop?.fulfillmentAutoApprove &&
    !shop?.fulfillmentAllowUnpaid &&
    !order?.isPaid;
  const unfulfilled = (order?.lines || []).filter(
    line => line.quantityToFulfill > 0,
  );

  const handleSubmit = async (data: MetadataFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    const result = await onSubmit({
      metadata,
      privateMetadata,
    });
    resetMetadataChanged();
    return getMutationErrors(result);
  };

  const initial: MetadataFormData = {
    metadata: order?.metadata.map(mapMetadataItemToInput),
    privateMetadata: order?.privateMetadata.map(mapMetadataItemToInput),
  };

  const saveLabel = isOrderUnconfirmed
    ? { confirm: intl.formatMessage(messages.confirmOrder) }
    : undefined;

  const allowSave = () => {
    if (!isOrderUnconfirmed) {
      return disabled;
    } else if (!order?.lines?.length) {
      return true;
    }
    return disabled;
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
      shouldExist: hasAnyItemsReplaceable(order as OrderSharedType),
    },
  ]);

  const { ORDER_DETAILS_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.ORDER_DETAILS,
  );

  const extensionMenuItems = mapToMenuItemsForOrderDetails(
    ORDER_DETAILS_MORE_ACTIONS,
    order?.id,
  );

  const openPlaygroundURL = playgroundOpenHandler({
    query: defaultGraphiQLQuery,
    headers: "",
    operationName: "",
    variables: `{ "id": "${order?.id}" }`,
  });

  return (
    <Form confirmLeave initial={initial} onSubmit={handleSubmit}>
      {({ change, data, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav
              href={orderListUrl()}
              title={<Title order={order as OrderSharedType} />}
            >
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
                />
              ) : (
                <>
                  <OrderDraftDetails
                    order={order as OrderSharedType}
                    errors={errors}
                    onOrderLineAdd={onOrderLineAdd}
                    onOrderLineChange={onOrderLineChange}
                    onOrderLineRemove={onOrderLineRemove}
                    onShippingMethodEdit={onShippingMethodEdit}
                  />
                  <CardSpacer />
                </>
              )}
              {order?.fulfillments?.map(fulfillment => (
                <React.Fragment key={fulfillment.id}>
                  <OrderFulfilledProductsCard
                    fulfillment={fulfillment}
                    fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
                    order={order as OrderSharedType}
                    onOrderFulfillmentCancel={() =>
                      onFulfillmentCancel(fulfillment.id)
                    }
                    onTrackingCodeAdd={() =>
                      onFulfillmentTrackingNumberUpdate(fulfillment.id)
                    }
                    onOrderFulfillmentApprove={() =>
                      onFulfillmentApprove(fulfillment.id)
                    }
                  />
                </React.Fragment>
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
              />
              <Metadata data={data} onChange={changeMetadata} />
              <OrderHistory
                history={order?.events}
                orderCurrency={order?.total?.gross.currency}
                onNoteAdd={onNoteAdd}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <OrderCustomer
                canEditAddresses={canEditAddresses}
                canEditCustomer={false}
                order={order as OrderSharedType}
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
            <Savebar
              labels={saveLabel}
              onCancel={() => navigate(orderListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={allowSave()}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
