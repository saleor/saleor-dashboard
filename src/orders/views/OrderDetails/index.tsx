import React from "react";

import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { customerUrl } from "../../../customers/urls";
import { getMutationState, maybe, transformAddressToForm } from "../../../misc";
import { productUrl } from "../../../products/urls";
import { OrderStatus } from "../../../types/globalTypes";
import OrderAddressEditDialog from "../../components/OrderAddressEditDialog";
import OrderCancelDialog from "../../components/OrderCancelDialog";
import OrderDetailsPage from "../../components/OrderDetailsPage";
import OrderDraftCancelDialog from "../../components/OrderDraftCancelDialog/OrderDraftCancelDialog";
import OrderDraftFinalizeDialog, {
  OrderDraftFinalizeWarning
} from "../../components/OrderDraftFinalizeDialog";
import OrderDraftPage from "../../components/OrderDraftPage";
import OrderFulfillmentCancelDialog from "../../components/OrderFulfillmentCancelDialog";
import OrderFulfillmentDialog from "../../components/OrderFulfillmentDialog";
import OrderFulfillmentTrackingDialog from "../../components/OrderFulfillmentTrackingDialog";
import OrderMarkAsPaidDialog from "../../components/OrderMarkAsPaidDialog/OrderMarkAsPaidDialog";
import OrderPaymentDialog from "../../components/OrderPaymentDialog";
import OrderPaymentVoidDialog from "../../components/OrderPaymentVoidDialog";
import OrderProductAddDialog from "../../components/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../components/OrderShippingMethodEditDialog";
import OrderOperations from "../../containers/OrderOperations";
import { TypedOrderDetailsQuery, useOrderVariantSearch } from "../../queries";
import { OrderDetails_order } from "../../types/OrderDetails";
import {
  orderListUrl,
  orderUrl,
  OrderUrlQueryParams,
  OrderUrlDialog
} from "../../urls";
import { OrderDetailsMessages } from "./OrderDetailsMessages";

const orderDraftFinalizeWarnings = (order: OrderDetails_order) => {
  const warnings = [] as OrderDraftFinalizeWarning[];
  if (!(order && order.shippingAddress)) {
    warnings.push(OrderDraftFinalizeWarning.NO_SHIPPING);
  }
  if (!(order && order.billingAddress)) {
    warnings.push(OrderDraftFinalizeWarning.NO_BILLING);
  }
  if (!(order && (order.user || order.userEmail))) {
    warnings.push(OrderDraftFinalizeWarning.NO_USER);
  }
  if (
    order &&
    order.lines &&
    order.lines.filter(line => line.isShippingRequired).length > 0 &&
    order.shippingMethod === null
  ) {
    warnings.push(OrderDraftFinalizeWarning.NO_SHIPPING_METHOD);
  }
  if (
    order &&
    order.lines &&
    order.lines.filter(line => line.isShippingRequired).length === 0 &&
    order.shippingMethod !== null
  ) {
    warnings.push(OrderDraftFinalizeWarning.UNNECESSARY_SHIPPING_METHOD);
  }
  return warnings;
};

interface OrderDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const { user } = useUser();
  const {
    loadMore: loadMoreCustomers,
    search: searchUsers,
    result: users
  } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts
  } = useOrderVariantSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const handleBack = () => navigate(orderListUrl());

  return (
    <TypedOrderDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading }) => {
        const order = data?.order;

        if (order === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const [openModal, closeModal] = createDialogActionHandlers<
          OrderUrlDialog,
          OrderUrlQueryParams
        >(navigate, params => orderUrl(id, params), params);

        return (
          <OrderDetailsMessages>
            {orderMessages => (
              <OrderOperations
                order={id}
                onOrderFulfillmentCreate={
                  orderMessages.handleOrderFulfillmentCreate
                }
                onNoteAdd={orderMessages.handleNoteAdd}
                onOrderCancel={orderMessages.handleOrderCancel}
                onOrderVoid={orderMessages.handleOrderVoid}
                onPaymentCapture={orderMessages.handlePaymentCapture}
                onPaymentRefund={orderMessages.handlePaymentRefund}
                onUpdate={orderMessages.handleUpdate}
                onDraftUpdate={orderMessages.handleDraftUpdate}
                onShippingMethodUpdate={
                  orderMessages.handleShippingMethodUpdate
                }
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
              >
                {({
                  orderAddNote,
                  orderCancel,
                  orderCreateFulfillment,
                  orderDraftUpdate,
                  orderLinesAdd,
                  orderLineDelete,
                  orderLineUpdate,
                  orderPaymentCapture,
                  orderPaymentRefund,
                  orderVoid,
                  orderShippingMethodUpdate,
                  orderUpdate,
                  orderFulfillmentCancel,
                  orderFulfillmentUpdateTracking,
                  orderDraftCancel,
                  orderDraftFinalize,
                  orderPaymentMarkAsPaid
                }) => (
                  <>
                    {maybe(() => order.status !== OrderStatus.DRAFT) ? (
                      <>
                        <WindowTitle
                          title={maybe(() => "Order #" + data.order.number)}
                        />
                        <OrderDetailsPage
                          onNoteAdd={variables =>
                            orderAddNote.mutate({
                              input: variables,
                              order: id
                            })
                          }
                          onBack={handleBack}
                          order={order}
                          shippingMethods={maybe(
                            () => data.order.availableShippingMethods,
                            []
                          )}
                          userPermissions={maybe(() => user.permissions, [])}
                          onOrderCancel={() => openModal("cancel")}
                          onOrderFulfill={() => openModal("fulfill")}
                          onFulfillmentCancel={fulfillmentId =>
                            navigate(
                              orderUrl(id, {
                                action: "cancel-fulfillment",
                                id: fulfillmentId
                              })
                            )
                          }
                          onFulfillmentTrackingNumberUpdate={fulfillmentId =>
                            navigate(
                              orderUrl(id, {
                                action: "edit-fulfillment",
                                id: fulfillmentId
                              })
                            )
                          }
                          onPaymentCapture={() => openModal("capture")}
                          onPaymentVoid={() => openModal("void")}
                          onPaymentRefund={() => openModal("refund")}
                          onProductClick={id => () => navigate(productUrl(id))}
                          onBillingAddressEdit={() =>
                            openModal("edit-billing-address")
                          }
                          onShippingAddressEdit={() =>
                            openModal("edit-shipping-address")
                          }
                          onPaymentPaid={() => openModal("mark-paid")}
                          onProfileView={() =>
                            navigate(customerUrl(order.user.id))
                          }
                        />
                        <OrderCancelDialog
                          confirmButtonState={getMutationState(
                            orderCancel.opts.called,
                            orderCancel.opts.loading,
                            orderCancel.opts.data?.orderCancel.errors || []
                          )}
                          number={maybe(() => order.number)}
                          open={params.action === "cancel"}
                          onClose={closeModal}
                          onSubmit={variables =>
                            orderCancel.mutate({
                              id,
                              ...variables
                            })
                          }
                        />
                        <OrderMarkAsPaidDialog
                          confirmButtonState={getMutationState(
                            orderPaymentMarkAsPaid.opts.called,
                            orderPaymentMarkAsPaid.opts.loading,
                            maybe(
                              () =>
                                orderPaymentMarkAsPaid.opts.data.orderMarkAsPaid
                                  .errors
                            )
                          )}
                          onClose={closeModal}
                          onConfirm={() =>
                            orderPaymentMarkAsPaid.mutate({
                              id
                            })
                          }
                          open={params.action === "mark-paid"}
                        />
                        <OrderPaymentVoidDialog
                          confirmButtonState={getMutationState(
                            orderVoid.opts.called,
                            orderVoid.opts.loading,
                            maybe(() => orderVoid.opts.data.orderVoid.errors)
                          )}
                          open={params.action === "void"}
                          onClose={closeModal}
                          onConfirm={() => orderVoid.mutate({ id })}
                        />
                        <OrderPaymentDialog
                          confirmButtonState={getMutationState(
                            orderPaymentCapture.opts.called,
                            orderPaymentCapture.opts.loading,
                            maybe(
                              () =>
                                orderPaymentCapture.opts.data.orderCapture
                                  .errors
                            )
                          )}
                          initial={maybe(() => order.total.gross.amount)}
                          open={params.action === "capture"}
                          variant="capture"
                          onClose={closeModal}
                          onSubmit={variables =>
                            orderPaymentCapture.mutate({
                              ...variables,
                              id
                            })
                          }
                        />
                        <OrderPaymentDialog
                          confirmButtonState={getMutationState(
                            orderPaymentRefund.opts.called,
                            orderPaymentRefund.opts.loading,
                            orderPaymentRefund.opts.data?.orderRefund.errors ||
                              []
                          )}
                          initial={maybe(() => order.total.gross.amount)}
                          open={params.action === "refund"}
                          variant="refund"
                          onClose={closeModal}
                          onSubmit={variables =>
                            orderPaymentRefund.mutate({
                              ...variables,
                              id
                            })
                          }
                        />
                        <OrderFulfillmentDialog
                          confirmButtonState={getMutationState(
                            orderCreateFulfillment.opts.called,
                            orderCreateFulfillment.opts.loading,
                            maybe(
                              () =>
                                orderCreateFulfillment.opts.data
                                  .orderFulfillmentCreate.errors
                            )
                          )}
                          open={params.action === "fulfill"}
                          lines={maybe(() => order.lines, []).filter(
                            line => line.quantityFulfilled < line.quantity
                          )}
                          onClose={closeModal}
                          onSubmit={variables =>
                            orderCreateFulfillment.mutate({
                              input: {
                                ...variables,
                                lines: maybe(() => order.lines, [])
                                  .filter(
                                    line =>
                                      line.quantityFulfilled < line.quantity
                                  )
                                  .map((line, lineIndex) => ({
                                    orderLineId: line.id,
                                    quantity: variables.lines[lineIndex]
                                  }))
                                  .filter(line => line.quantity > 0)
                              },
                              order: order.id
                            })
                          }
                        />
                        <OrderFulfillmentCancelDialog
                          confirmButtonState={getMutationState(
                            orderFulfillmentCancel.opts.called,
                            orderFulfillmentCancel.opts.loading,
                            maybe(
                              () =>
                                orderFulfillmentCancel.opts.data
                                  .orderFulfillmentCancel.errors
                            )
                          )}
                          open={params.action === "cancel-fulfillment"}
                          onConfirm={variables =>
                            orderFulfillmentCancel.mutate({
                              id: params.id,
                              input: variables
                            })
                          }
                          onClose={closeModal}
                        />
                        <OrderFulfillmentTrackingDialog
                          confirmButtonState={getMutationState(
                            orderFulfillmentUpdateTracking.opts.called,
                            orderFulfillmentUpdateTracking.opts.loading,
                            maybe(
                              () =>
                                orderFulfillmentUpdateTracking.opts.data
                                  .orderFulfillmentUpdateTracking.errors
                            )
                          )}
                          open={params.action === "edit-fulfillment"}
                          trackingNumber={maybe(
                            () =>
                              data.order.fulfillments.find(
                                fulfillment => fulfillment.id === params.id
                              ).trackingNumber
                          )}
                          onConfirm={variables =>
                            orderFulfillmentUpdateTracking.mutate({
                              id: params.id,
                              input: {
                                ...variables,
                                notifyCustomer: true
                              }
                            })
                          }
                          onClose={closeModal}
                        />
                      </>
                    ) : (
                      <>
                        <WindowTitle
                          title={maybe(
                            () => "Draft order #" + data.order.number
                          )}
                        />
                        <OrderDraftPage
                          disabled={loading}
                          onNoteAdd={variables =>
                            orderAddNote.mutate({
                              input: variables,
                              order: id
                            })
                          }
                          users={maybe(
                            () =>
                              users.data.search.edges.map(edge => edge.node),
                            []
                          )}
                          hasMore={maybe(
                            () => users.data.search.pageInfo.hasNextPage,
                            false
                          )}
                          onFetchMore={loadMoreCustomers}
                          fetchUsers={searchUsers}
                          loading={users.loading}
                          usersLoading={users.loading}
                          onCustomerEdit={data =>
                            orderDraftUpdate.mutate({
                              id,
                              input: data
                            })
                          }
                          onDraftFinalize={() => openModal("finalize")}
                          onDraftRemove={() => openModal("cancel")}
                          onOrderLineAdd={() => openModal("add-order-line")}
                          onBack={() => navigate(orderListUrl())}
                          order={order}
                          countries={maybe(() => data.shop.countries, []).map(
                            country => ({
                              code: country.code,
                              label: country.country
                            })
                          )}
                          onProductClick={id => () =>
                            navigate(productUrl(encodeURIComponent(id)))}
                          onBillingAddressEdit={() =>
                            openModal("edit-billing-address")
                          }
                          onShippingAddressEdit={() =>
                            openModal("edit-shipping-address")
                          }
                          onShippingMethodEdit={() =>
                            openModal("edit-shipping")
                          }
                          onOrderLineRemove={id =>
                            orderLineDelete.mutate({ id })
                          }
                          onOrderLineChange={(id, data) =>
                            orderLineUpdate.mutate({
                              id,
                              input: data
                            })
                          }
                          saveButtonBarState="default"
                          onProfileView={() =>
                            navigate(customerUrl(order.user.id))
                          }
                          userPermissions={maybe(() => user.permissions, [])}
                        />
                        <OrderDraftCancelDialog
                          confirmButtonState={getMutationState(
                            orderDraftCancel.opts.called,
                            orderDraftCancel.opts.loading,
                            maybe(
                              () =>
                                orderDraftCancel.opts.data.draftOrderDelete
                                  .errors
                            )
                          )}
                          onClose={closeModal}
                          onConfirm={() => orderDraftCancel.mutate({ id })}
                          open={params.action === "cancel"}
                          orderNumber={maybe(() => order.number)}
                        />
                        <OrderDraftFinalizeDialog
                          confirmButtonState={orderDraftFinalize.opts.status}
                          onClose={closeModal}
                          onConfirm={() => orderDraftFinalize.mutate({ id })}
                          open={params.action === "finalize"}
                          orderNumber={maybe(() => order.number)}
                          warnings={orderDraftFinalizeWarnings(order)}
                        />
                        <OrderShippingMethodEditDialog
                          confirmButtonState={getMutationState(
                            orderShippingMethodUpdate.opts.called,
                            orderShippingMethodUpdate.opts.loading,
                            maybe(
                              () =>
                                orderShippingMethodUpdate.opts.data
                                  .orderUpdateShipping.errors
                            )
                          )}
                          open={params.action === "edit-shipping"}
                          shippingMethod={maybe(
                            () => order.shippingMethod.id,
                            "..."
                          )}
                          shippingMethods={maybe(
                            () => order.availableShippingMethods
                          )}
                          onClose={closeModal}
                          onSubmit={variables =>
                            orderShippingMethodUpdate.mutate({
                              id,
                              input: {
                                shippingMethod: variables.shippingMethod
                              }
                            })
                          }
                        />
                        <OrderProductAddDialog
                          confirmButtonState={getMutationState(
                            orderLinesAdd.opts.called,
                            orderLinesAdd.opts.loading,
                            maybe(
                              () =>
                                orderLinesAdd.opts.data.draftOrderLinesCreate
                                  .errors
                            )
                          )}
                          loading={variantSearchOpts.loading}
                          open={params.action === "add-order-line"}
                          hasMore={maybe(
                            () =>
                              variantSearchOpts.data.search.pageInfo.hasNextPage
                          )}
                          products={maybe(() =>
                            variantSearchOpts.data.search.edges.map(
                              edge => edge.node
                            )
                          )}
                          onClose={closeModal}
                          onFetch={variantSearch}
                          onFetchMore={loadMore}
                          onSubmit={variants =>
                            orderLinesAdd.mutate({
                              id,
                              input: variants.map(variant => ({
                                quantity: 1,
                                variantId: variant.id
                              }))
                            })
                          }
                        />
                      </>
                    )}
                    <OrderAddressEditDialog
                      confirmButtonState={getMutationState(
                        orderUpdate.opts.called,
                        orderUpdate.opts.loading,
                        maybe(() => orderUpdate.opts.data.orderUpdate.errors)
                      )}
                      address={transformAddressToForm(
                        maybe(() => order.shippingAddress)
                      )}
                      countries={maybe(() => data.shop.countries, []).map(
                        country => ({
                          code: country.code,
                          label: country.country
                        })
                      )}
                      errors={maybe(
                        () => orderUpdate.opts.data.orderUpdate.errors,
                        []
                      )}
                      open={params.action === "edit-shipping-address"}
                      variant="shipping"
                      onClose={closeModal}
                      onConfirm={shippingAddress =>
                        orderUpdate.mutate({
                          id,
                          input: {
                            shippingAddress
                          }
                        })
                      }
                    />
                    <OrderAddressEditDialog
                      confirmButtonState={getMutationState(
                        orderUpdate.opts.called,
                        orderUpdate.opts.loading,
                        maybe(() => orderUpdate.opts.data.orderUpdate.errors)
                      )}
                      address={transformAddressToForm(
                        maybe(() => order.billingAddress)
                      )}
                      countries={maybe(() => data.shop.countries, []).map(
                        country => ({
                          code: country.code,
                          label: country.country
                        })
                      )}
                      errors={maybe(
                        () => orderUpdate.opts.data.orderUpdate.errors,
                        []
                      )}
                      open={params.action === "edit-billing-address"}
                      variant="billing"
                      onClose={closeModal}
                      onConfirm={billingAddress =>
                        orderUpdate.mutate({
                          id,
                          input: {
                            billingAddress
                          }
                        })
                      }
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
