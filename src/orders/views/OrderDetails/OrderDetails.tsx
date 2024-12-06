// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import { MetadataIdSchema } from "@dashboard/components/Metadata";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import {
  JobStatusEnum,
  OrderDetailsWithMetadataDocument,
  OrderStatus,
  useOrderConfirmMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { createOrderMetadataIdSchema } from "@dashboard/orders/components/OrderDetailsPage/utils";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useIntl } from "react-intl";

import OrderOperations from "../../containers/OrderOperations";
import { orderListUrl, orderUrl, OrderUrlDialog, OrderUrlQueryParams } from "../../urls";
import { OrderDetailsMessages } from "./OrderDetailsMessages";
import { OrderDraftDetails } from "./OrderDraftDetails";
import { OrderNormalDetails } from "./OrderNormalDetails";
import { OrderUnconfirmedDetails } from "./OrderUnconfirmedDetails";
import { useOrderDetails } from "./useOrderDetails";

interface OrderDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
}

export const OrderDetails = ({ id, params }: OrderDetailsProps) => {
  const navigate = useNavigator();
  const { queue } = useBackgroundTask();
  const intl = useIntl();
  const [updateMetadata, updateMetadataOpts] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata, updatePrivateMetadataOpts] = useUpdatePrivateMetadataMutation({});
  const notify = useNotifier();
  const apolloClient = useApolloClient();
  const [openModal, closeModal] = createDialogActionHandlers<OrderUrlDialog, OrderUrlQueryParams>(
    navigate,
    params => orderUrl(id, params),
    params,
    ["type"],
  );
  const handleBack = () => navigate(orderListUrl());
  const [orderConfirm] = useOrderConfirmMutation({
    onCompleted: ({ orderConfirm: { errors } }) => {
      const isError = !!errors.length;

      notify({
        status: isError ? "error" : "success",
        text: isError ? getOrderErrorMessage(errors[0], intl) : "Confirmed Order",
      });
    },
  });

  const { data, loading } = useOrderDetails(id);

  const order = data?.order;

  if (order === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const isOrderDraft = order?.status === OrderStatus.DRAFT;
  const handleSubmit = async (data: MetadataIdSchema) => {
    if (order?.status === OrderStatus.UNCONFIRMED) {
      await orderConfirm({ variables: { id: order?.id } });
    }

    const initial = createOrderMetadataIdSchema(order);
    const metadataPromises = Object.entries(initial).map(([id, metaEntry]) => {
      const update = createMetadataUpdateHandler(
        { ...metaEntry, id },
        () => Promise.resolve([]),
        variables => updateMetadata({ variables }),
        variables => updatePrivateMetadata({ variables }),
      );

      return update(data[id]);
    });
    const result = await Promise.all(metadataPromises);
    const errors = result.reduce((p, c) => p.concat(c), []);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }

    return result;
  };

  return (
    <OrderDetailsMessages id={id} params={params}>
      {orderMessages => (
        <OrderOperations
          order={id}
          onNoteAdd={orderMessages.handleNoteAdd}
          onOrderCancel={orderMessages.handleOrderCancel}
          onOrderVoid={orderMessages.handleOrderVoid}
          onPaymentCapture={orderMessages.handlePaymentCapture}
          onUpdate={orderMessages.handleUpdate}
          onDraftUpdate={orderMessages.handleDraftUpdate}
          onShippingMethodUpdate={data => {
            orderMessages.handleShippingMethodUpdate(data);
            order.total = data.orderUpdateShipping.order.total;
          }}
          onOrderLineDelete={orderMessages.handleOrderLineDelete}
          onOrderLinesAdd={orderMessages.handleOrderLinesAdd}
          onOrderLineUpdate={orderMessages.handleOrderLineUpdate}
          onOrderFulfillmentApprove={orderMessages.handleOrderFulfillmentApprove}
          onOrderFulfillmentCancel={orderMessages.handleOrderFulfillmentCancel}
          onOrderFulfillmentUpdate={orderMessages.handleOrderFulfillmentUpdate}
          onDraftFinalize={orderMessages.handleDraftFinalize}
          onDraftCancel={orderMessages.handleDraftCancel}
          onOrderMarkAsPaid={orderMessages.handleOrderMarkAsPaid}
          onInvoiceRequest={data => {
            if (data.invoiceRequest.invoice.status === JobStatusEnum.SUCCESS) {
              orderMessages.handleInvoiceGenerateFinished(data);
            } else {
              orderMessages.handleInvoiceGeneratePending(data);
              queue(Task.INVOICE_GENERATE, {
                generateInvoice: {
                  invoiceId: data.invoiceRequest.invoice.id,
                  orderId: id,
                },
              });
            }
          }}
          onInvoiceSend={orderMessages.handleInvoiceSend}
          onTransactionActionSend={orderMessages.handleTransactionAction}
          onManualTransactionAdded={async data => {
            await apolloClient.refetchQueries({
              include: [OrderDetailsWithMetadataDocument],
            });
            orderMessages.handleAddManualTransaction(data);
          }}
        >
          {({
            orderAddNote,
            orderCancel,
            orderDraftUpdate,
            orderLinesAdd,
            orderLineDelete,
            orderLineUpdate,
            orderPaymentCapture,
            orderVoid,
            orderShippingMethodUpdate,
            orderUpdate,
            orderFulfillmentApprove,
            orderFulfillmentCancel,
            orderFulfillmentUpdateTracking,
            orderDraftCancel,
            orderDraftFinalize,
            orderPaymentMarkAsPaid,
            orderInvoiceRequest,
            orderInvoiceSend,
            orderTransactionAction,
            orderAddManualTransaction,
          }) => (
            <>
              {!isOrderDraft && !isOrderUnconfirmed && (
                <OrderNormalDetails
                  id={id}
                  params={params}
                  loading={loading}
                  data={data}
                  orderAddNote={orderAddNote}
                  orderInvoiceRequest={orderInvoiceRequest}
                  handleSubmit={handleSubmit}
                  orderUpdate={orderUpdate}
                  orderCancel={orderCancel}
                  orderPaymentMarkAsPaid={orderPaymentMarkAsPaid}
                  orderVoid={orderVoid}
                  orderPaymentCapture={orderPaymentCapture}
                  orderFulfillmentApprove={orderFulfillmentApprove}
                  orderFulfillmentCancel={orderFulfillmentCancel}
                  orderFulfillmentUpdateTracking={orderFulfillmentUpdateTracking}
                  orderInvoiceSend={orderInvoiceSend}
                  orderTransactionAction={orderTransactionAction}
                  orderAddManualTransaction={orderAddManualTransaction}
                  updateMetadataOpts={updateMetadataOpts}
                  updatePrivateMetadataOpts={updatePrivateMetadataOpts}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              )}
              {isOrderDraft && (
                <OrderDraftDetails
                  id={id}
                  params={params}
                  loading={loading}
                  data={data}
                  orderAddNote={orderAddNote}
                  orderLineUpdate={orderLineUpdate}
                  orderLineDelete={orderLineDelete}
                  orderShippingMethodUpdate={orderShippingMethodUpdate}
                  orderLinesAdd={orderLinesAdd}
                  orderDraftUpdate={orderDraftUpdate}
                  orderDraftCancel={orderDraftCancel}
                  orderDraftFinalize={orderDraftFinalize}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              )}
              {isOrderUnconfirmed && (
                <OrderUnconfirmedDetails
                  id={id}
                  params={params}
                  data={data}
                  orderAddNote={orderAddNote}
                  orderLineUpdate={orderLineUpdate}
                  orderLineDelete={orderLineDelete}
                  orderInvoiceRequest={orderInvoiceRequest}
                  handleSubmit={handleSubmit}
                  orderUpdate={orderUpdate}
                  orderCancel={orderCancel}
                  orderShippingMethodUpdate={orderShippingMethodUpdate}
                  orderLinesAdd={orderLinesAdd}
                  orderPaymentMarkAsPaid={orderPaymentMarkAsPaid}
                  orderVoid={orderVoid}
                  orderPaymentCapture={orderPaymentCapture}
                  orderFulfillmentApprove={orderFulfillmentApprove}
                  orderFulfillmentCancel={orderFulfillmentCancel}
                  orderFulfillmentUpdateTracking={orderFulfillmentUpdateTracking}
                  orderInvoiceSend={orderInvoiceSend}
                  updateMetadataOpts={updateMetadataOpts}
                  updatePrivateMetadataOpts={updatePrivateMetadataOpts}
                  orderTransactionAction={orderTransactionAction}
                  orderAddManualTransaction={orderAddManualTransaction}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              )}
            </>
          )}
        </OrderOperations>
      )}
    </OrderDetailsMessages>
  );
};

export default OrderDetails;
