// @ts-strict-ignore
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type OrderFulfillmentApproveMutation,
  type OrderFulfillmentApproveMutationVariables,
  type OrderNoteUpdateMutation,
  type OrderNoteUpdateMutationVariables,
  type OrderUpdateMutation,
  type OrderUpdateMutationVariables,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { OrderFulfillmentApproveDialog } from "@dashboard/orders/components/OrderFulfillmentApproveDialog/OrderFulfillmentApproveDialog";
import { getVariantSearchAddress } from "@dashboard/orders/utils/data";
import { OrderDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { mapSearchOrderVariantsForAdd } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { useOrderVariantSearch } from "@dashboard/searches/useOrderVariantSearch";
import { type PartialMutationProviderOutput } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { extractMutationErrors, getStringOrPlaceholder } from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderDetailsPage from "../../../components/OrderDetailsPage/OrderDetailsPage";
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
import { OrderCommonDialogs } from "../shared/OrderCommonDialogs";

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
  const intl = useIntl();
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
      <OrderCommonDialogs
        orderId={id}
        order={order}
        countries={data?.shop?.countries}
        params={params}
        onClose={closeModal}
        operations={{
          orderCancel,
          orderUpdate,
          orderFulfillmentCancel,
          orderFulfillmentUpdateTracking,
          orderInvoiceSend,
        }}
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
    </>
  );
};
