import { MetadataFormData } from "@saleor/components/Metadata";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { Task } from "@saleor/containers/BackgroundTasks/types";
import useBackgroundTask from "@saleor/hooks/useBackgroundTask";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { useOrderConfirmMutation } from "@saleor/orders/mutations";
import { InvoiceRequest } from "@saleor/orders/types/InvoiceRequest";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { JobStatusEnum, OrderStatus } from "../../../types/globalTypes";
import OrderOperations from "../../containers/OrderOperations";
import { TypedOrderDetailsQuery } from "../../queries";
import {
  orderListUrl,
  orderUrl,
  OrderUrlDialog,
  OrderUrlQueryParams
} from "../../urls";
import OrderAddressFields from "./OrderAddressFields";
import { OrderDetailsMessages } from "./OrderDetailsMessages";
import { OrderDraftDetails } from "./OrderDraftDetails";
import { OrderNormalDetails } from "./OrderNormalDetails";
import { OrderUnconfirmedDetails } from "./OrderUnconfirmedDetails";

interface OrderDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();

  const { queue } = useBackgroundTask();
  const intl = useIntl();
  const [updateMetadata, updateMetadataOpts] = useMetadataUpdate({});
  const [
    updatePrivateMetadata,
    updatePrivateMetadataOpts
  ] = usePrivateMetadataUpdate({});
  const notify = useNotifier();

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderUrlDialog,
    OrderUrlQueryParams
  >(navigate, params => orderUrl(id, params), params);

  const handleBack = () => navigate(orderListUrl());

  const [orderConfirm] = useOrderConfirmMutation({
    onCompleted: ({ orderConfirm: { errors } }) => {
      const isError = !!errors.length;

      notify({
        status: isError ? "error" : "success",
        text: isError
          ? getOrderErrorMessage(errors[0], intl)
          : "Confirmed Order"
      });
    }
  });

  return (
    <TypedOrderDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading }) => {
        const order = data?.order;
        if (order === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
        const isOrderDraft = order?.status === OrderStatus.DRAFT;

        const handleSubmit = async (data: MetadataFormData) => {
          if (order?.status === OrderStatus.UNCONFIRMED) {
            await orderConfirm({ variables: { id: order?.id } });
          }

          const update = createMetadataUpdateHandler(
            order,
            () => Promise.resolve([]),
            variables => updateMetadata({ variables }),
            variables => updatePrivateMetadata({ variables })
          );
          const result = await update(data);

          if (result.length === 0) {
            notify({
              status: "success",
              text: intl.formatMessage(commonMessages.savedChanges)
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
                onOrderFulfillmentCancel={
                  orderMessages.handleOrderFulfillmentCancel
                }
                onOrderFulfillmentUpdate={
                  orderMessages.handleOrderFulfillmentUpdate
                }
                onDraftFinalize={orderMessages.handleDraftFinalize}
                onDraftCancel={orderMessages.handleDraftCancel}
                onOrderMarkAsPaid={orderMessages.handleOrderMarkAsPaid}
                onInvoiceRequest={(data: InvoiceRequest) => {
                  if (
                    data.invoiceRequest.invoice.status === JobStatusEnum.SUCCESS
                  ) {
                    orderMessages.handleInvoiceGenerateFinished(data);
                  } else {
                    orderMessages.handleInvoiceGeneratePending(data);
                    queue(Task.INVOICE_GENERATE, {
                      generateInvoice: {
                        invoiceId: data.invoiceRequest.invoice.id,
                        orderId: id
                      }
                    });
                  }
                }}
                onInvoiceSend={orderMessages.handleInvoiceSend}
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
                  orderFulfillmentCancel,
                  orderFulfillmentUpdateTracking,
                  orderDraftCancel,
                  orderDraftFinalize,
                  orderPaymentMarkAsPaid,
                  orderInvoiceRequest,
                  orderInvoiceSend
                }) => (
                  <>
                    {!isOrderDraft && !isOrderUnconfirmed && (
                      <OrderNormalDetails
                        id={id}
                        params={params}
                        data={data}
                        orderAddNote={orderAddNote}
                        orderInvoiceRequest={orderInvoiceRequest}
                        handleSubmit={handleSubmit}
                        orderCancel={orderCancel}
                        orderPaymentMarkAsPaid={orderPaymentMarkAsPaid}
                        orderVoid={orderVoid}
                        orderPaymentCapture={orderPaymentCapture}
                        orderFulfillmentCancel={orderFulfillmentCancel}
                        orderFulfillmentUpdateTracking={
                          orderFulfillmentUpdateTracking
                        }
                        orderInvoiceSend={orderInvoiceSend}
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
                        orderCancel={orderCancel}
                        orderShippingMethodUpdate={orderShippingMethodUpdate}
                        orderLinesAdd={orderLinesAdd}
                        orderPaymentMarkAsPaid={orderPaymentMarkAsPaid}
                        orderVoid={orderVoid}
                        orderPaymentCapture={orderPaymentCapture}
                        orderFulfillmentCancel={orderFulfillmentCancel}
                        orderFulfillmentUpdateTracking={
                          orderFulfillmentUpdateTracking
                        }
                        orderInvoiceSend={orderInvoiceSend}
                        updateMetadataOpts={updateMetadataOpts}
                        updatePrivateMetadataOpts={updatePrivateMetadataOpts}
                        openModal={openModal}
                        closeModal={closeModal}
                      />
                    )}
                    <OrderAddressFields
                      isDraft={order?.status === OrderStatus.DRAFT}
                      orderUpdate={orderUpdate}
                      orderDraftUpdate={orderDraftUpdate}
                      data={data}
                      id={id}
                      onClose={closeModal}
                      action={params.action}
                    />
                  </>
                )}
              </OrderOperations>
            )}
          </OrderDetailsMessages>
        );
      }}
    </TypedOrderDetailsQuery>
  );
};

export default OrderDetails;
