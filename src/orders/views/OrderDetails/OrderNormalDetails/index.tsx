import { CardSpacer } from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  type FulfillmentFragment,
  type OrderDetailsQueryResult,
  OrderErrorCode,
  OrderStatus,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors, getById, getStringOrPlaceholder } from "@dashboard/misc";
import { OrderFulfillmentApproveDialog } from "@dashboard/orders/components/OrderFulfillmentApproveDialog/OrderFulfillmentApproveDialog";
import { OrderFulfillStockExceededDialog } from "@dashboard/orders/components/OrderFulfillStockExceededDialog/OrderFulfillStockExceededDialog";
import { transformFuflillmentLinesToStockFormsetData } from "@dashboard/orders/utils/data";
import {
  type CloseModalFunction,
  type OpenModalFunction,
} from "@dashboard/utils/handlers/dialogActionHandlers";
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { OrderDetailsItemsSection } from "../../../components/OrderDetailsItemsSection/OrderDetailsItemsSection";
import { OrderHistory } from "../../../components/OrderHistory";
import OrderInvoiceList from "../../../components/OrderInvoiceList";
import { OrderSummary } from "../../../components/OrderSummary/OrderSummary";
import {
  orderDetailsUrl,
  orderFulfillUrl,
  orderReturnUrl,
  orderUrl,
  type OrderUrlDialog,
  type OrderUrlQueryParams,
  withOrderFulfillmentDialog,
  withOrderLineFocus,
} from "../../../urls";
import { type CommonOrderOperations } from "../operations/useCommonOrderOperations";
import { OrderCommonDialogs } from "../shared/OrderCommonDialogs";
import { OrderDetailsHeader } from "../shared/OrderDetailsHeader";
import { OrderDetailsSidebar } from "../shared/OrderDetailsSidebar";
import { useLinePriceBreakdown } from "../shared/useLinePriceBreakdown";

export interface OrderNormalDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: OrderDetailsQueryResult["data"];
  loading: boolean;
  common: CommonOrderOperations;
  openModal: OpenModalFunction<OrderUrlDialog, OrderUrlQueryParams>;
  closeModal: CloseModalFunction;
  /** Payment-mode owned slots, supplied by the concrete Legacy/Transaction view. */
  paymentActions?: ReactNode;
  paymentSection?: ReactNode;
}

interface ApprovalState {
  fulfillment: FulfillmentFragment | undefined;
  notifyCustomer: boolean;
}

const isInsufficientStockApprovalErrors = (errors: Array<{ code: OrderErrorCode }>): boolean =>
  errors.length > 0 && errors.every(error => error.code === OrderErrorCode.INSUFFICIENT_STOCK);

/**
 * Placed (non-draft, confirmed) order details. Payment-neutral: the payment
 * summary actions and the payment section arrive as slots from the concrete
 * Legacy/Transaction view.
 */
export const OrderNormalDetails = ({
  id,
  params,
  data,
  loading,
  common,
  openModal,
  closeModal,
  paymentActions,
  paymentSection,
}: OrderNormalDetailsProps): ReactElement | null => {
  const order = data?.order;
  const shop = data?.shop;
  const navigate = useNavigator();
  const intl = useIntl();
  const [currentApproval, setCurrentApproval] = useState<ApprovalState | null>(null);
  const [stockExceeded, setStockExceeded] = useState(false);
  const { orderFulfillmentApprove } = common;
  const previousApproveStatus = useRef<ConfirmButtonTransitionState>(
    orderFulfillmentApprove.opts.status,
  );
  const { onShowLinePriceBreakdown, priceBreakdownModal } = useLinePriceBreakdown(order);

  useEffect(() => {
    if (params.action === "approve-fulfillment" && params.id) {
      setStockExceeded(false);
    }
  }, [params.action, params.id]);

  useEffect(() => {
    const previousStatus = previousApproveStatus.current;

    previousApproveStatus.current = orderFulfillmentApprove.opts.status;

    if (previousStatus !== "loading" || orderFulfillmentApprove.opts.status === "loading") {
      return;
    }

    const errors = orderFulfillmentApprove.opts.data?.orderFulfillmentApprove?.errors ?? [];

    if (isInsufficientStockApprovalErrors(errors)) {
      setStockExceeded(true);
    }
  }, [orderFulfillmentApprove.opts.data, orderFulfillmentApprove.opts.status]);

  // The route only mounts this view once the order query resolved.
  if (!order || !shop) {
    return null;
  }

  const errors = common.orderUpdate.opts.data?.orderUpdate?.errors ?? [];
  const approvalErrors = orderFulfillmentApprove.opts.data?.orderFulfillmentApprove?.errors ?? [];
  const approveDialogErrors = stockExceeded
    ? []
    : approvalErrors.filter(error => error.code !== OrderErrorCode.INSUFFICIENT_STOCK);
  const unfulfilled = (order.lines || []).filter(line => line.quantityToFulfill > 0);
  const hasFulfillments = (order.fulfillments?.length ?? 0) > 0;

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
      <DetailPageLayout withSavebar={false}>
        <OrderDetailsHeader
          order={order}
          onShowMetadata={() => openModal("view-order-metadata")}
          onCancel={() => openModal("cancel")}
        />

        <DetailPageLayout.Content data-test-id="order-fulfillment">
          <OrderDetailsItemsSection
            order={order}
            shop={shop}
            loading={loading}
            canFulfill={order.status !== OrderStatus.CANCELED}
            notAllowedToFulfillUnpaid={
              shop.fulfillmentAutoApprove && !shop.fulfillmentAllowUnpaid && !order.isPaid
            }
            onOrderFulfill={() => navigate(orderFulfillUrl(id))}
            onOrderReturn={() => navigate(orderReturnUrl(id))}
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
            onOrderLineShowMetadata={lineId =>
              openModal("view-order-line-metadata", { id: lineId })
            }
            onFulfillmentShowMetadata={fulfillmentId =>
              openModal("view-fulfillment-metadata", { id: fulfillmentId })
            }
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
            focusedLineId={params.lineId}
            onFocusedLineChange={lineId =>
              navigate(orderDetailsUrl(id, withOrderLineFocus(params, lineId), order.status), {
                replace: true,
              })
            }
          />

          {(unfulfilled.length > 0 || hasFulfillments) && <CardSpacer />}
          <OrderSummary order={order} actions={paymentActions} />

          {paymentSection && (
            <>
              <CardSpacer />
              {paymentSection}
            </>
          )}

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
            invoices={
              <OrderInvoiceList
                invoices={order.invoices}
                onInvoiceClick={invoiceId =>
                  window.open(
                    order.invoices?.find(invoice => invoice.id === invoiceId)?.url ?? undefined,
                    "_blank",
                    "rel=noopener",
                  )
                }
                onInvoiceGenerate={() => common.orderInvoiceRequest.mutate({ orderId: id })}
                onInvoiceSend={invoiceId => openModal("invoice-send", { id: invoiceId })}
              />
            }
          />
        </DetailPageLayout.RightSidebar>
        {priceBreakdownModal}
      </DetailPageLayout>

      <OrderCommonDialogs
        orderId={id}
        order={order}
        countries={shop?.countries}
        params={params}
        onClose={closeModal}
        operations={common}
      />
      <OrderFulfillmentApproveDialog
        confirmButtonState={orderFulfillmentApprove.opts.status}
        errors={approveDialogErrors}
        open={params.action === "approve-fulfillment" && !stockExceeded}
        onConfirm={({ notifyCustomer }) => {
          setCurrentApproval({
            fulfillment: order.fulfillments.find(getById(params.id ?? "")),
            notifyCustomer,
          });

          return orderFulfillmentApprove.mutate({ id: params.id ?? "", notifyCustomer });
        }}
        onClose={closeModal}
      />
      <OrderFulfillStockExceededDialog
        lines={currentApproval?.fulfillment?.lines ?? undefined}
        formsetData={
          // Stock quantities are per warehouse; without one there is nothing to compare.
          currentApproval?.fulfillment?.warehouse
            ? transformFuflillmentLinesToStockFormsetData(
                currentApproval.fulfillment.lines,
                currentApproval.fulfillment.warehouse,
              )
            : []
        }
        open={stockExceeded}
        onClose={() => setStockExceeded(false)}
        confirmButtonState={orderFulfillmentApprove.opts.status}
        onSubmit={() => {
          setStockExceeded(false);

          return orderFulfillmentApprove.mutate({
            id: params.id ?? "",
            notifyCustomer: currentApproval?.notifyCustomer ?? false,
            allowStockToBeExceeded: true,
          });
        }}
      />
    </>
  );
};
