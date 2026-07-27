// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import {
  JobStatusEnum,
  OrderDetailsDocument,
  OrderStatus,
  useOrderConfirmMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationState } from "@dashboard/misc";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import OrderOperations from "../../containers/OrderOperations";
import { useOrderDetailsUrlCanonicalization } from "../../hooks/useOrderDetailsUrlCanonicalization";
import { resolveOrderPaymentMode } from "../../resolveOrderPaymentMode";
import {
  orderDetailsUrl,
  orderDraftListUrl,
  orderListUrl,
  type OrderUrlDialog,
  type OrderUrlQueryParams,
} from "../../urls";
import { handleOrderDetailsSubmit } from "./handleOrderDetailsSubmit";
import { LegacyOrderDetails } from "./LegacyOrderDetails/LegacyOrderDetails";
import { orderDetailsMessages } from "./messages";
import { type NonDraftOrderDetailsProps } from "./nonDraftOrderDetailsProps";
import { OrderDetailsMessages } from "./OrderDetailsMessages";
import { OrderDraftDetails } from "./OrderDraftDetails";
import { TransactionOrderDetails } from "./TransactionOrderDetails/TransactionOrderDetails";
import { useOrderDetails } from "./useOrderDetails";

interface OrderDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
}

const OrderDetails = ({ id, params }: OrderDetailsProps) => {
  const navigate = useNavigator();
  const { queue } = useBackgroundTask();
  const intl = useIntl();
  const [updateMetadata, updateMetadataOpts] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata, updatePrivateMetadataOpts] = useUpdatePrivateMetadataMutation({});
  const notify = useNotifier();
  const apolloClient = useApolloClient();
  const { data, loading } = useOrderDetails(id);

  const order = data?.order;
  const isOrderDraft = order?.status === OrderStatus.DRAFT;

  useOrderDetailsUrlCanonicalization(id, order?.status);

  const buildOrderUrl = useCallback(
    (urlParams: OrderUrlQueryParams) => orderDetailsUrl(id, urlParams, order?.status),
    [id, order?.status],
  );

  const [openModal, closeModal] = createDialogActionHandlers<OrderUrlDialog, OrderUrlQueryParams>(
    navigate,
    buildOrderUrl,
    params,
    ["type"],
  );
  const handleBack = () =>
    navigate(order?.status === OrderStatus.DRAFT ? orderDraftListUrl() : orderListUrl());
  const [orderConfirm, orderConfirmOpts] = useOrderConfirmMutation({
    onCompleted: data => {
      const errors = data.orderConfirm?.errors ?? [];
      const isError = errors.length > 0;

      notify({
        status: isError ? "error" : "success",
        text: isError
          ? getOrderErrorMessage(errors[0], intl)
          : intl.formatMessage(orderDetailsMessages.orderConfirmed, {
              orderNumber: data.orderConfirm?.order?.number ?? order?.number,
            }),
      });
    },
  });
  const confirmSaveButtonBarState: ConfirmButtonTransitionState = getMutationState(
    orderConfirmOpts.called || updateMetadataOpts.called || updatePrivateMetadataOpts.called,
    orderConfirmOpts.loading || updateMetadataOpts.loading || updatePrivateMetadataOpts.loading,
    [
      ...(orderConfirmOpts.data?.orderConfirm?.errors || []),
      ...(updateMetadataOpts.data?.deleteMetadata.errors || []),
      ...(updateMetadataOpts.data?.updateMetadata.errors || []),
      ...(updatePrivateMetadataOpts.data?.deletePrivateMetadata.errors || []),
      ...(updatePrivateMetadataOpts.data?.updatePrivateMetadata.errors || []),
    ],
    orderConfirmOpts.error ? [{ error: orderConfirmOpts.error }] : [],
  );

  if (order === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const handleSubmit = async (formData: MetadataIdSchema) =>
    handleOrderDetailsSubmit({
      formData,
      intl,
      notify,
      order,
      orderConfirm,
      updateMetadata: variables => updateMetadata({ variables }),
      updatePrivateMetadata: variables => updatePrivateMetadata({ variables }),
    });

  return (
    <OrderDetailsMessages id={id} orderStatus={order?.status} params={params}>
      {orderMessages => (
        <OrderOperations
          order={id}
          onNoteAdd={orderMessages.handleNoteAdd}
          onNoteUpdate={orderMessages.handleNoteUpdate}
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
          onTransactionActionSend={async data => {
            await apolloClient.refetchQueries({
              include: [OrderDetailsDocument],
            });
            orderMessages.handleTransactionAction(data);
          }}
          onManualTransactionAdded={async data => {
            await apolloClient.refetchQueries({
              include: [OrderDetailsDocument],
            });
            orderMessages.handleAddManualTransaction(data);
          }}
        >
          {({
            orderAddNote,
            orderUpdateNote,
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
          }) => {
            // Superset of props both lifecycle views need; the concrete
            // payment-mode views forward it while delegation is temporary (T5).
            const nonDraftProps: NonDraftOrderDetailsProps = {
              id,
              params,
              loading,
              data,
              orderAddNote,
              orderUpdateNote,
              orderInvoiceRequest,
              orderUpdate,
              orderCancel,
              orderPaymentMarkAsPaid,
              orderVoid,
              orderPaymentCapture,
              orderFulfillmentApprove,
              orderFulfillmentCancel,
              orderFulfillmentUpdateTracking,
              orderInvoiceSend,
              orderTransactionAction,
              orderAddManualTransaction,
              orderLineUpdate,
              orderLineDelete,
              orderShippingMethodUpdate,
              orderLinesAdd,
              handleSubmit,
              saveButtonBarState: confirmSaveButtonBarState,
              openModal,
              closeModal,
            };

            return (
              <>
                {order &&
                  !isOrderDraft &&
                  // The single non-draft payment-mode branch: resolve once, route
                  // to one concrete view. Draft stays outside the resolver.
                  (resolveOrderPaymentMode(order).kind === "transactions" ? (
                    <TransactionOrderDetails {...nonDraftProps} />
                  ) : (
                    <LegacyOrderDetails {...nonDraftProps} />
                  ))}
                {order && isOrderDraft && (
                  <OrderDraftDetails
                    id={id}
                    params={params}
                    loading={loading}
                    data={data}
                    orderAddNote={orderAddNote}
                    orderUpdateNote={orderUpdateNote}
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
              </>
            );
          }}
        </OrderOperations>
      )}
    </OrderDetailsMessages>
  );
};

export default OrderDetails;
