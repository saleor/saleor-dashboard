import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  CreateManualTransactionCaptureMutation,
  CreateManualTransactionCaptureMutationVariables,
  FulfillmentStatus,
  OrderFulfillmentApproveMutation,
  OrderFulfillmentApproveMutationVariables,
  OrderTransactionRequestActionMutation,
  OrderTransactionRequestActionMutationVariables,
  OrderUpdateMutation,
  OrderUpdateMutationVariables,
  useCustomerAddressesQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import OrderCannotCancelOrderDialog from "@dashboard/orders/components/OrderCannotCancelOrderDialog";
import { OrderCustomerAddressesEditDialogOutput } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/types";
import OrderFulfillmentApproveDialog from "@dashboard/orders/components/OrderFulfillmentApproveDialog";
import OrderInvoiceEmailSendDialog from "@dashboard/orders/components/OrderInvoiceEmailSendDialog";
import { OrderManualTransactionDialog } from "@dashboard/orders/components/OrderManualTransactionDialog";
import { OrderTransactionActionDialog } from "@dashboard/orders/components/OrderTransactionActionDialog/OrderTransactionActionDialog";
import { isAnyAddressEditModalOpen } from "@dashboard/orders/utils/data";
import { OrderDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { useOrderVariantSearch } from "@dashboard/searches/useOrderVariantSearch";
import { PartialMutationProviderOutput } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import {
  extractMutationErrors,
  getMutationState,
  getStringOrPlaceholder,
} from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import OrderCancelDialog from "../../../components/OrderCancelDialog";
import OrderDetailsPage from "../../../components/OrderDetailsPage";
import OrderFulfillmentCancelDialog from "../../../components/OrderFulfillmentCancelDialog";
import OrderFulfillmentTrackingDialog from "../../../components/OrderFulfillmentTrackingDialog";
import OrderMarkAsPaidDialog from "../../../components/OrderMarkAsPaidDialog/OrderMarkAsPaidDialog";
import OrderPaymentDialog from "../../../components/OrderPaymentDialog";
import OrderPaymentVoidDialog from "../../../components/OrderPaymentVoidDialog";
import OrderProductAddDialog from "../../../components/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import {
  orderFulfillUrl,
  orderPaymentRefundUrl,
  orderReturnUrl,
  orderUrl,
  OrderUrlQueryParams,
} from "../../../urls";

interface OrderUnconfirmedDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: any;
  orderAddNote: any;
  orderLineUpdate: any;
  orderLineDelete: any;
  orderInvoiceRequest: any;
  handleSubmit: any;
  orderUpdate: PartialMutationProviderOutput<
    OrderUpdateMutation,
    OrderUpdateMutationVariables
  >;
  orderCancel: any;
  orderShippingMethodUpdate: any;
  orderLinesAdd: any;
  orderPaymentMarkAsPaid: any;
  orderVoid: any;
  orderPaymentCapture: any;
  orderFulfillmentApprove: PartialMutationProviderOutput<
    OrderFulfillmentApproveMutation,
    OrderFulfillmentApproveMutationVariables
  >;
  orderFulfillmentCancel: any;
  orderFulfillmentUpdateTracking: any;
  orderTransactionAction: PartialMutationProviderOutput<
    OrderTransactionRequestActionMutation,
    OrderTransactionRequestActionMutationVariables
  >;
  orderAddManualTransaction: PartialMutationProviderOutput<
    CreateManualTransactionCaptureMutation,
    CreateManualTransactionCaptureMutationVariables
  >;
  orderInvoiceSend: any;
  updateMetadataOpts: any;
  updatePrivateMetadataOpts: any;
  openModal: any;
  closeModal: any;
}

export const OrderUnconfirmedDetails: React.FC<
  OrderUnconfirmedDetailsProps
> = ({
  id,
  params,
  data,
  orderAddNote,
  orderLineUpdate,
  orderLineDelete,
  orderInvoiceRequest,
  handleSubmit,
  orderUpdate,
  orderCancel,
  orderShippingMethodUpdate,
  orderLinesAdd,
  orderPaymentMarkAsPaid,
  orderVoid,
  orderPaymentCapture,
  orderFulfillmentApprove,
  orderFulfillmentCancel,
  orderFulfillmentUpdateTracking,
  orderInvoiceSend,
  updateMetadataOpts,
  updatePrivateMetadataOpts,
  orderTransactionAction,
  orderAddManualTransaction,
  openModal,
  closeModal,
}) => {
  const order = data.order;
  const shop = data.shop;
  const navigate = useNavigator();

  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts,
  } = useOrderVariantSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel: order.channel.slug,
    },
  });
  const warehouses = useWarehouseListQuery({
    displayLoader: true,
    variables: {
      first: 30,
    },
  });

  const { data: customerAddresses, loading: customerAddressesLoading } =
    useCustomerAddressesQuery({
      variables: {
        id: order?.user?.id,
      },
      skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
    });

  const handleCustomerChangeAddresses = async (
    data: Partial<OrderCustomerAddressesEditDialogOutput>,
  ): Promise<any> =>
    orderUpdate.mutate({
      id,
      input: data,
    });

  const intl = useIntl();
  const [transactionReference, setTransactionReference] = React.useState("");

  const errors = orderUpdate.opts.data?.orderUpdate.errors || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          {
            id: "GbBCmr",
            defaultMessage: "Order #{orderNumber}",
            description: "window title",
          },
          {
            orderNumber: getStringOrPlaceholder(order.number),
          },
        )}
      />
      <OrderDiscountProvider order={order}>
        <OrderLineDiscountProvider order={order}>
          <OrderDetailsPage
            onOrderReturn={() => navigate(orderReturnUrl(id))}
            disabled={
              updateMetadataOpts.loading || updatePrivateMetadataOpts.loading
            }
            errors={errors}
            onNoteAdd={variables =>
              extractMutationErrors(
                orderAddNote.mutate({
                  input: variables,
                  order: id,
                }),
              )
            }
            order={order}
            shop={shop}
            onTransactionAction={(id, action) =>
              openModal("transaction-action", {
                type: action,
                id,
                action: "transaction-action",
              })
            }
            onOrderLineAdd={() => openModal("add-order-line")}
            onOrderLineChange={(id, data) =>
              orderLineUpdate.mutate({
                id,
                input: data,
              })
            }
            onOrderLineRemove={id => orderLineDelete.mutate({ id })}
            onShippingMethodEdit={() => openModal("edit-shipping")}
            saveButtonBarState={getMutationState(
              updateMetadataOpts.called || updatePrivateMetadataOpts.called,
              updateMetadataOpts.loading || updatePrivateMetadataOpts.loading,
              [
                ...(updateMetadataOpts.data?.deleteMetadata.errors || []),
                ...(updateMetadataOpts.data?.updateMetadata.errors || []),
                ...(updatePrivateMetadataOpts.data?.deletePrivateMetadata
                  .errors || []),
                ...(updatePrivateMetadataOpts.data?.updatePrivateMetadata
                  .errors || []),
              ],
            )}
            shippingMethods={data?.order?.shippingMethods || []}
            onOrderCancel={() => openModal("cancel")}
            onOrderFulfill={() => navigate(orderFulfillUrl(id))}
            onFulfillmentApprove={fulfillmentId =>
              navigate(
                orderUrl(id, {
                  action: "approve-fulfillment",
                  id: fulfillmentId,
                }),
              )
            }
            onFulfillmentCancel={fulfillmentId =>
              navigate(
                orderUrl(id, {
                  action: "cancel-fulfillment",
                  id: fulfillmentId,
                }),
              )
            }
            onFulfillmentTrackingNumberUpdate={fulfillmentId =>
              navigate(
                orderUrl(id, {
                  action: "edit-fulfillment",
                  id: fulfillmentId,
                }),
              )
            }
            onPaymentCapture={() => openModal("capture")}
            onPaymentVoid={() => openModal("void")}
            onPaymentRefund={() => navigate(orderPaymentRefundUrl(id))}
            onProductClick={id => () => navigate(productUrl(id))}
            onBillingAddressEdit={() => openModal("edit-billing-address")}
            onShippingAddressEdit={() => openModal("edit-shipping-address")}
            onMarkAsPaid={() => openModal("mark-paid")}
            onProfileView={() => navigate(customerUrl(order.user.id))}
            onAddManualTransaction={() => openModal("add-manual-transaction")}
            onInvoiceClick={id =>
              window.open(
                order.invoices.find(invoice => invoice.id === id)?.url,
                "_blank",
                "rel=noopener",
              )
            }
            onInvoiceGenerate={() =>
              orderInvoiceRequest.mutate({
                orderId: id,
              })
            }
            onInvoiceSend={id => openModal("invoice-send", { id })}
            onSubmit={handleSubmit}
          />
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>
      <OrderCannotCancelOrderDialog
        onClose={closeModal}
        open={
          params.action === "cancel" &&
          order?.fulfillments.some(
            fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED,
          )
        }
      />
      <OrderCancelDialog
        confirmButtonState={orderCancel.opts.status}
        errors={orderCancel.opts.data?.orderCancel.errors || []}
        number={order?.number}
        open={params.action === "cancel"}
        onClose={closeModal}
        onSubmit={() =>
          orderCancel.mutate({
            id,
          })
        }
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={orderShippingMethodUpdate.opts.status}
        errors={
          orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []
        }
        open={params.action === "edit-shipping"}
        shippingMethod={order?.shippingMethod?.id}
        shippingMethods={order?.shippingMethods}
        onClose={closeModal}
        onSubmit={variables =>
          extractMutationErrors(
            orderShippingMethodUpdate.mutate({
              id,
              input: {
                shippingMethod: variables.shippingMethod,
              },
            }),
          )
        }
      />
      <OrderProductAddDialog
        confirmButtonState={orderLinesAdd.opts.status}
        errors={orderLinesAdd.opts.data?.orderLinesCreate.errors || []}
        loading={variantSearchOpts.loading}
        open={params.action === "add-order-line"}
        hasMore={variantSearchOpts.data?.search.pageInfo.hasNextPage}
        products={mapEdgesToItems(variantSearchOpts?.data?.search)}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        channelName={order.channel?.name}
        onSubmit={variants =>
          orderLinesAdd.mutate({
            id,
            input: variants.map(variant => ({
              quantity: 1,
              variantId: variant.id,
            })),
          })
        }
      />
      <OrderMarkAsPaidDialog
        confirmButtonState={orderPaymentMarkAsPaid.opts.status}
        errors={orderPaymentMarkAsPaid.opts.data?.orderMarkAsPaid.errors || []}
        onClose={closeModal}
        onConfirm={() =>
          orderPaymentMarkAsPaid.mutate({
            id,
            transactionReference,
          })
        }
        open={params.action === "mark-paid"}
        transactionReference={transactionReference}
        handleTransactionReference={({ target }) =>
          setTransactionReference(target.value)
        }
      />
      <OrderTransactionActionDialog
        confirmButtonState={orderTransactionAction.opts.status}
        onClose={closeModal}
        open={params.action === "transaction-action"}
        action={params.type}
        onSubmit={() =>
          orderTransactionAction.mutate({
            action: params.type,
            transactionId: params.id,
          })
        }
      />
      <OrderPaymentVoidDialog
        confirmButtonState={orderVoid.opts.status}
        errors={orderVoid.opts.data?.orderVoid.errors || []}
        open={params.action === "void"}
        onClose={closeModal}
        onConfirm={() => orderVoid.mutate({ id })}
      />
      <OrderPaymentDialog
        confirmButtonState={orderPaymentCapture.opts.status}
        errors={orderPaymentCapture.opts.data?.orderCapture.errors || []}
        initial={order?.total.gross.amount}
        open={params.action === "capture"}
        onClose={closeModal}
        onSubmit={variables =>
          orderPaymentCapture.mutate({
            ...variables,
            id,
          })
        }
      />
      <OrderFulfillmentApproveDialog
        confirmButtonState={orderFulfillmentApprove.opts.status}
        errors={
          orderFulfillmentApprove.opts.data?.orderFulfillmentApprove.errors ||
          []
        }
        open={params.action === "approve-fulfillment"}
        onConfirm={({ notifyCustomer }) =>
          orderFulfillmentApprove.mutate({
            id: params.id,
            notifyCustomer,
          })
        }
        onClose={closeModal}
      />
      <OrderFulfillmentCancelDialog
        confirmButtonState={orderFulfillmentCancel.opts.status}
        errors={
          orderFulfillmentCancel.opts.data?.orderFulfillmentCancel.errors || []
        }
        open={params.action === "cancel-fulfillment"}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses)}
        onConfirm={variables =>
          orderFulfillmentCancel.mutate({
            id: params.id,
            input: variables,
          })
        }
        onClose={closeModal}
      />
      <OrderFulfillmentTrackingDialog
        confirmButtonState={orderFulfillmentUpdateTracking.opts.status}
        errors={
          orderFulfillmentUpdateTracking.opts.data
            ?.orderFulfillmentUpdateTracking.errors || []
        }
        open={params.action === "edit-fulfillment"}
        trackingNumber={
          data?.order?.fulfillments.find(
            fulfillment => fulfillment.id === params.id,
          )?.trackingNumber
        }
        onConfirm={variables =>
          orderFulfillmentUpdateTracking.mutate({
            id: params.id,
            input: {
              ...variables,
              notifyCustomer: true,
            },
          })
        }
        onClose={closeModal}
      />
      <OrderInvoiceEmailSendDialog
        confirmButtonState={orderInvoiceSend.opts.status}
        errors={orderInvoiceSend.opts.data?.invoiceSendEmail.errors || []}
        open={params.action === "invoice-send"}
        invoice={order?.invoices?.find(invoice => invoice.id === params.id)}
        onClose={closeModal}
        onSend={() => orderInvoiceSend.mutate({ id: params.id })}
      />
      <OrderManualTransactionDialog
        dialogProps={{
          open: params.action === "add-manual-transaction",
          onClose: closeModal,
        }}
        submitState={orderAddManualTransaction.opts.status}
        error={
          orderAddManualTransaction.opts?.error?.message ||
          orderAddManualTransaction.opts?.data?.transactionCreate?.errors?.[0]
            ?.message
        }
        currency={data?.order?.totalBalance?.currency}
        onAddTransaction={({ amount, description }) =>
          orderAddManualTransaction.mutate({
            currency: data?.order?.totalBalance?.currency,
            orderId: id,
            amount,
            description,
          })
        }
      />
      <OrderAddressFields
        action={params?.action}
        customerAddressesLoading={customerAddressesLoading}
        orderShippingAddress={order?.shippingAddress}
        orderBillingAddress={order?.billingAddress}
        isDraft={false}
        countries={data?.shop?.countries}
        customer={customerAddresses?.user}
        onClose={closeModal}
        onConfirm={handleCustomerChangeAddresses}
        confirmButtonState={orderUpdate.opts.status}
        errors={orderUpdate.opts.data?.orderUpdate.errors}
      />
    </>
  );
};

export default OrderUnconfirmedDetails;
