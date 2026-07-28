import { CardSpacer } from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { type OrderDetailsQueryResult } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { OrderFulfillmentApproveDialog } from "@dashboard/orders/components/OrderFulfillmentApproveDialog/OrderFulfillmentApproveDialog";
import { getVariantSearchAddress } from "@dashboard/orders/utils/data";
import {
  OrderDiscountContext,
  OrderDiscountProvider,
} from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { mapSearchOrderVariantsForAdd } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { useOrderVariantSearch } from "@dashboard/searches/useOrderVariantSearch";
import {
  type CloseModalFunction,
  type OpenModalFunction,
} from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type ReactElement, type ReactNode } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { messages } from "../../../components/OrderDetailsPage/messages";
import { createOrderMetadataIdSchema } from "../../../components/OrderDetailsPage/utils";
import OrderDraftDetails from "../../../components/OrderDraftDetails/OrderDraftDetails";
import { OrderFulfillmentCard } from "../../../components/OrderFulfillmentCard/OrderFulfillmentCard";
import { OrderHistory } from "../../../components/OrderHistory";
import { OrderProductAddDialog } from "../../../components/OrderProductAddDialog/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import { OrderSummary } from "../../../components/OrderSummary/OrderSummary";
import { orderListUrl, orderUrl, withOrderFulfillmentDialog } from "../../../urls";
import { type OrderUrlDialog, type OrderUrlQueryParams } from "../../../urls";
import { type CommonOrderOperations } from "../operations/useCommonOrderOperations";
import { OrderCommonDialogs } from "../shared/OrderCommonDialogs";
import { OrderDetailsHeader } from "../shared/OrderDetailsHeader";
import { OrderDetailsSidebar } from "../shared/OrderDetailsSidebar";
import { useLinePriceBreakdown } from "../shared/useLinePriceBreakdown";

export interface OrderUnconfirmedDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: OrderDetailsQueryResult["data"];
  loading: boolean;
  common: CommonOrderOperations;
  handleSubmit: (data: MetadataIdSchema) => Promise<unknown[]>;
  saveButtonBarState: ConfirmButtonTransitionState;
  openModal: OpenModalFunction<OrderUrlDialog, OrderUrlQueryParams>;
  closeModal: CloseModalFunction;
  /** Payment-mode owned slots, supplied by the concrete Legacy/Transaction view. */
  paymentActions?: ReactNode;
  paymentSection?: ReactNode;
}

/**
 * Unconfirmed order details: still editable (lines, shipping method) and
 * confirmed through the savebar. Payment-neutral: the payment summary actions
 * and the payment section arrive as slots from the concrete view.
 */
export const OrderUnconfirmedDetails = ({
  id,
  params,
  data,
  loading,
  common,
  handleSubmit,
  saveButtonBarState,
  openModal,
  closeModal,
  paymentActions,
  paymentSection,
}: OrderUnconfirmedDetailsProps): ReactElement | null => {
  const order = data?.order;
  const shop = data?.shop;
  const navigate = useNavigator();
  const intl = useIntl();
  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts,
  } = useOrderVariantSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel: order?.channel?.slug ?? "",
    },
  });
  const { onShowLinePriceBreakdown, priceBreakdownModal } = useLinePriceBreakdown(order);

  // The route only mounts this view once the order query resolved.
  if (!order || !shop) {
    return null;
  }

  const errors = common.orderUpdate.opts.data?.orderUpdate?.errors ?? [];
  const isSaving = loading || saveButtonBarState === "loading";
  const renderLayout = (submit: () => SubmitPromise<unknown[]>) => (
    <DetailPageLayout withSavebar>
      <OrderDetailsHeader
        order={order}
        onShowMetadata={() => openModal("view-order-metadata")}
        onCancel={() => openModal("cancel")}
      />

      <DetailPageLayout.Content data-test-id="order-fulfillment">
        <OrderDraftDetails
          order={order}
          errors={errors}
          loading={isSaving}
          onOrderLineShowMetadata={lineId => openModal("view-order-line-metadata", { id: lineId })}
          onOrderLineAdd={() => openModal("add-order-line")}
          onOrderLineChange={(lineId, lineData) =>
            common.orderLineUpdate.mutate({ id: lineId, input: lineData })
          }
          onOrderLineRemove={lineId => common.orderLineDelete.mutate({ id: lineId })}
          orderLineRemoveConfirmState={common.orderLineDelete.opts.status}
          orderLineRemoveErrors={common.orderLineDelete.opts.data?.orderLineDelete?.errors ?? []}
        />
        <CardSpacer />

        {order.fulfillments?.map((fulfillment, index) => (
          <OrderFulfillmentCard
            key={fulfillment.id}
            dataTestId="fulfilled-order-section"
            fulfillment={fulfillment}
            fulfillmentAllowUnpaid={shop.fulfillmentAllowUnpaid}
            order={order}
            onOrderLineShowMetadata={lineId =>
              openModal("view-order-line-metadata", { id: lineId })
            }
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
            onFulfillmentShowMetadata={() =>
              openModal("view-fulfillment-metadata", { id: fulfillment.id })
            }
            onOrderFulfillmentCancel={() =>
              navigate(
                orderUrl(
                  id,
                  withOrderFulfillmentDialog(params, "cancel-fulfillment", fulfillment.id),
                ),
              )
            }
            onTrackingCodeAdd={() =>
              navigate(
                orderUrl(
                  id,
                  withOrderFulfillmentDialog(params, "edit-fulfillment", fulfillment.id),
                ),
              )
            }
            onOrderFulfillmentApprove={() =>
              navigate(
                orderUrl(
                  id,
                  withOrderFulfillmentDialog(params, "approve-fulfillment", fulfillment.id),
                ),
              )
            }
            showBottomSeparator={index < (order.fulfillments?.length ?? 0) - 1}
          />
        ))}

        <OrderDiscountContext.Consumer>
          {discountContext =>
            discountContext && (
              <>
                {(order.fulfillments?.length ?? 0) > 0 && <CardSpacer />}
                <OrderSummary
                  order={order}
                  actions={paymentActions}
                  isEditable
                  onShippingMethodEdit={() => openModal("edit-shipping")}
                  errors={errors}
                  {...discountContext}
                />

                {paymentSection && (
                  <>
                    <CardSpacer />
                    {paymentSection}
                  </>
                )}
              </>
            )
          }
        </OrderDiscountContext.Consumer>

        <CardSpacer />
        <OrderHistory
          history={order.events}
          onNoteUpdateLoading={common.orderUpdateNote.opts.loading}
          orderCurrency={order.total?.gross.currency}
          onNoteAdd={variables =>
            extractMutationErrors(common.orderAddNote.mutate({ input: variables, order: id }))
          }
          onNoteUpdate={(noteId, message) =>
            common.orderUpdateNote.mutate({ order: noteId, input: { message } })
          }
        />
      </DetailPageLayout.Content>

      <DetailPageLayout.RightSidebar>
        <OrderDetailsSidebar
          order={order}
          errors={errors}
          onBillingAddressEdit={() => openModal("edit-billing-address")}
          onShippingAddressEdit={() => openModal("edit-shipping-address")}
          onProfileView={() => {
            if (order.user) {
              navigate(customerUrl(order.user.id));
            }
          }}
        />
      </DetailPageLayout.RightSidebar>

      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={() => navigate(orderListUrl())} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={submit}
          disabled={order.lines?.length ? isSaving : true}
        >
          {intl.formatMessage(messages.confirmOrder)}
        </Savebar.ConfirmButton>
      </Savebar>
      {priceBreakdownModal}
    </DetailPageLayout>
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
          { orderNumber: getStringOrPlaceholder(order.number) },
        )}
      />
      <OrderDiscountProvider order={order}>
        <OrderLineDiscountProvider order={order}>
          <Form
            confirmLeave
            initial={createOrderMetadataIdSchema(order)}
            onSubmit={handleSubmit}
            mergeData={false}
          >
            {({ submit }) => renderLayout(submit)}
          </Form>
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>

      <OrderCommonDialogs
        orderId={id}
        order={order}
        countries={shop.countries}
        params={params}
        onClose={closeModal}
        operations={common}
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={common.orderShippingMethodUpdate.opts.status}
        errors={common.orderShippingMethodUpdate.opts.data?.orderUpdateShipping?.errors || []}
        open={params.action === "edit-shipping"}
        shippingMethod={order.shippingMethod?.id}
        shippingMethodName={order.shippingMethodName ?? undefined}
        shippingPrice={order.shippingPrice}
        shippingMethods={order.shippingMethods}
        onClose={closeModal}
        onSubmit={variables =>
          extractMutationErrors(
            common.orderShippingMethodUpdate.mutate({
              id,
              input: { shippingMethod: variables.shippingMethod },
            }),
          )
        }
      />
      <OrderProductAddDialog
        confirmButtonState={common.orderLinesAdd.opts.status}
        errors={common.orderLinesAdd.opts.data?.orderLinesCreate?.errors || []}
        loading={variantSearchOpts.loading}
        open={params.action === "add-order-line"}
        hasMore={variantSearchOpts.data?.search?.pageInfo.hasNextPage ?? false}
        products={mapSearchOrderVariantsForAdd(mapEdgesToItems(variantSearchOpts?.data?.search))}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        channelName={order.channel?.name}
        channel={order.channel?.slug}
        address={getVariantSearchAddress(order)}
        onSubmit={variants =>
          common.orderLinesAdd.mutate({
            id,
            input: variants.map(variant => ({ quantity: 1, variantId: variant.id })),
          })
        }
      />
      <OrderFulfillmentApproveDialog
        confirmButtonState={common.orderFulfillmentApprove.opts.status}
        errors={common.orderFulfillmentApprove.opts.data?.orderFulfillmentApprove?.errors || []}
        open={params.action === "approve-fulfillment"}
        onConfirm={({ notifyCustomer }) =>
          common.orderFulfillmentApprove.mutate({ id: params.id ?? "", notifyCustomer })
        }
        onClose={closeModal}
      />
    </>
  );
};
