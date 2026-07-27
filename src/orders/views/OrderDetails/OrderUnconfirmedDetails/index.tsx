// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  FulfillmentStatus,
  type OrderFulfillmentApproveMutation,
  type OrderFulfillmentApproveMutationVariables,
  type OrderNoteUpdateMutation,
  type OrderNoteUpdateMutationVariables,
  type OrderUpdateMutation,
  type OrderUpdateMutationVariables,
  useCustomerAddressesQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { OrderCannotCancelOrderDialog } from "@dashboard/orders/components/OrderCannotCancelOrderDialog/OrderCannotCancelOrderDialog";
import { type OrderCustomerAddressesEditDialogOutput } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/types";
import { OrderFulfillmentApproveDialog } from "@dashboard/orders/components/OrderFulfillmentApproveDialog/OrderFulfillmentApproveDialog";
import OrderInvoiceEmailSendDialog from "@dashboard/orders/components/OrderInvoiceEmailSendDialog";
import { OrderLineMetadataDialog } from "@dashboard/orders/components/OrderLineMetadataDialog/OrderLineMetadataDialog";
import { OrderMetadataDialog } from "@dashboard/orders/components/OrderMetadataDialog/OrderMetadataDialog";
import { getVariantSearchAddress, isAnyAddressEditModalOpen } from "@dashboard/orders/utils/data";
import { OrderDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { mapSearchOrderVariantsForAdd } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { useOrderVariantSearch } from "@dashboard/searches/useOrderVariantSearch";
import { type PartialMutationProviderOutput } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { extractMutationErrors, getById, getStringOrPlaceholder } from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import { OrderCancelDialog } from "../../../components/OrderCancelDialog";
import OrderDetailsPage from "../../../components/OrderDetailsPage/OrderDetailsPage";
import OrderFulfillmentCancelDialog from "../../../components/OrderFulfillmentCancelDialog";
import { OrderFulfillmentTrackingDialog } from "../../../components/OrderFulfillmentTrackingDialog/OrderFulfillmentTrackingDialog";
import { OrderProductAddDialog } from "../../../components/OrderProductAddDialog/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import {
  orderDetailsUrl,
  orderFulfillUrl,
  orderReturnUrl,
  orderUrl,
  type OrderUrlQueryParams,
  withOrderFulfillmentDialog,
  withOrderLineFocus,
} from "../../../urls";

export interface OrderUnconfirmedDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: any;
  loading: boolean;
  orderAddNote: any;
  orderUpdateNote: PartialMutationProviderOutput<
    OrderNoteUpdateMutation,
    OrderNoteUpdateMutationVariables
  >;
  orderLineUpdate: any;
  orderLineDelete: any;
  orderInvoiceRequest: any;
  handleSubmit: any;
  orderUpdate: PartialMutationProviderOutput<OrderUpdateMutation, OrderUpdateMutationVariables>;
  orderCancel: any;
  orderShippingMethodUpdate: any;
  orderLinesAdd: any;
  orderFulfillmentApprove: PartialMutationProviderOutput<
    OrderFulfillmentApproveMutation,
    OrderFulfillmentApproveMutationVariables
  >;
  orderFulfillmentCancel: any;
  orderFulfillmentUpdateTracking: any;
  orderInvoiceSend: any;
  saveButtonBarState: ConfirmButtonTransitionState;
  openModal: any;
  closeModal: any;
  /** Payment-mode owned slots, supplied by the concrete Legacy/Transaction view. */
  paymentActions?: ReactNode;
  paymentSection?: ReactNode;
}

export const OrderUnconfirmedDetails = ({
  id,
  params,
  data,
  loading,
  orderAddNote,
  orderUpdateNote,
  orderLineUpdate,
  orderLineDelete,
  orderInvoiceRequest,
  handleSubmit,
  orderUpdate,
  orderCancel,
  orderShippingMethodUpdate,
  orderLinesAdd,
  orderFulfillmentApprove,
  orderFulfillmentCancel,
  orderFulfillmentUpdateTracking,
  orderInvoiceSend,
  saveButtonBarState,
  openModal,
  closeModal,
  paymentActions,
  paymentSection,
}: OrderUnconfirmedDetailsProps) => {
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
  const { data: customerAddresses, loading: customerAddressesLoading } = useCustomerAddressesQuery({
    variables: {
      id: order?.user?.id,
    },
    skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
  });
  const handleCustomerChangeAddresses = async (
    data: Partial<OrderCustomerAddressesEditDialogOutput>,
  ): Promise<FetchResult<OrderUpdateMutation>> =>
    orderUpdate.mutate({
      id,
      input: data,
    });
  const intl = useIntl();
  const errors = orderUpdate.opts.data?.orderUpdate.errors || [];
  const hasOrderFulfillmentsFulFilled = order?.fulfillments.some(
    fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED,
  );

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
            loading={loading || saveButtonBarState === "loading"}
            errors={errors}
            onNoteAdd={variables =>
              extractMutationErrors(
                orderAddNote.mutate({
                  input: variables,
                  order: id,
                }),
              )
            }
            onNoteUpdateLoading={orderUpdateNote.opts.loading}
            onNoteUpdate={(id, message) =>
              orderUpdateNote.mutate({
                order: id,
                input: {
                  message,
                },
              })
            }
            order={order}
            shop={shop}
            paymentActions={paymentActions}
            paymentSection={paymentSection}
            onOrderLineAdd={() => openModal("add-order-line")}
            onOrderLineChange={(id, data) =>
              orderLineUpdate.mutate({
                id,
                input: data,
              })
            }
            onOrderLineRemove={id => orderLineDelete.mutate({ id })}
            orderLineRemoveConfirmState={orderLineDelete.opts.status}
            orderLineRemoveErrors={orderLineDelete.opts.data?.orderLineDelete?.errors ?? []}
            onShippingMethodEdit={() => openModal("edit-shipping")}
            onOrderLineShowMetadata={id => openModal("view-order-line-metadata", { id })}
            onOrderShowMetadata={() => openModal("view-order-metadata")}
            onFulfillmentShowMetadata={id => openModal("view-fulfillment-metadata", { id })}
            saveButtonBarState={saveButtonBarState}
            shippingMethods={data?.order?.shippingMethods || []}
            onOrderCancel={() => openModal("cancel")}
            onOrderFulfill={() => navigate(orderFulfillUrl(id))}
            onFulfillmentApprove={fulfillmentId =>
              navigate(
                orderUrl(
                  id,
                  withOrderFulfillmentDialog(params, "approve-fulfillment", fulfillmentId),
                ),
              )
            }
            onFulfillmentCancel={fulfillmentId =>
              navigate(
                orderUrl(
                  id,
                  withOrderFulfillmentDialog(params, "cancel-fulfillment", fulfillmentId),
                ),
              )
            }
            onFulfillmentTrackingNumberUpdate={fulfillmentId =>
              navigate(
                orderUrl(id, withOrderFulfillmentDialog(params, "edit-fulfillment", fulfillmentId)),
              )
            }
            onProductClick={id => () => navigate(productUrl(id))}
            onBillingAddressEdit={() => openModal("edit-billing-address")}
            onShippingAddressEdit={() => openModal("edit-shipping-address")}
            onProfileView={() => navigate(customerUrl(order.user.id))}
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
            focusedLineId={params.lineId}
            onFocusedLineChange={lineId =>
              navigate(orderDetailsUrl(id, withOrderLineFocus(params, lineId), order?.status), {
                replace: true,
              })
            }
          />
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>
      <OrderCannotCancelOrderDialog
        onClose={closeModal}
        open={params.action === "cancel" && hasOrderFulfillmentsFulFilled}
      />
      <OrderCancelDialog
        confirmButtonState={orderCancel.opts.status}
        errors={orderCancel.opts.data?.orderCancel.errors || []}
        number={order?.number}
        open={params.action === "cancel" && !hasOrderFulfillmentsFulFilled}
        onClose={closeModal}
        onSubmit={() =>
          orderCancel.mutate({
            id,
          })
        }
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={orderShippingMethodUpdate.opts.status}
        errors={orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []}
        open={params.action === "edit-shipping"}
        shippingMethod={order?.shippingMethod?.id}
        shippingMethodName={order?.shippingMethodName}
        shippingPrice={order?.shippingPrice}
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
        products={mapSearchOrderVariantsForAdd(mapEdgesToItems(variantSearchOpts?.data?.search))}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        channelName={order.channel?.name}
        channel={order.channel?.slug}
        address={getVariantSearchAddress(order)}
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
      <OrderLineMetadataDialog
        open={params.action === "view-order-line-metadata"}
        onClose={closeModal}
        lineId={params.id}
        orderId={id}
      />
      <OrderMetadataDialog
        open={params.action === "view-order-metadata"}
        onClose={closeModal}
        orderId={id}
      />
      <OrderFulfillmentApproveDialog
        confirmButtonState={orderFulfillmentApprove.opts.status}
        errors={orderFulfillmentApprove.opts.data?.orderFulfillmentApprove.errors || []}
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
        errors={orderFulfillmentCancel.opts.data?.orderFulfillmentCancel.errors || []}
        open={params.action === "cancel-fulfillment"}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses)}
        fulfillmentStatus={order?.fulfillments.find(getById(params.id))?.status}
        defaultWarehouseId={order?.fulfillments.find(getById(params.id))?.warehouse?.id}
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
          orderFulfillmentUpdateTracking.opts.data?.orderFulfillmentUpdateTracking.errors || []
        }
        open={params.action === "edit-fulfillment"}
        trackingNumber={
          data?.order?.fulfillments.find(fulfillment => fulfillment.id === params.id)
            ?.trackingNumber
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
