// @ts-strict-ignore
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  type FulfillmentFragment,
  type OrderDetailsQueryResult,
  OrderErrorCode,
  type OrderFulfillmentApproveMutation,
  type OrderFulfillmentApproveMutationVariables,
  type OrderNoteUpdateMutation,
  type OrderNoteUpdateMutationVariables,
  type OrderUpdateMutation,
  type OrderUpdateMutationVariables,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors, getById, getStringOrPlaceholder } from "@dashboard/misc";
import { OrderFulfillmentApproveDialog } from "@dashboard/orders/components/OrderFulfillmentApproveDialog/OrderFulfillmentApproveDialog";
import { OrderFulfillStockExceededDialog } from "@dashboard/orders/components/OrderFulfillStockExceededDialog/OrderFulfillStockExceededDialog";
import { transformFuflillmentLinesToStockFormsetData } from "@dashboard/orders/utils/data";
import { type PartialMutationProviderOutput } from "@dashboard/types";
import {
  type CloseModalFunction,
  type OpenModalFunction,
} from "@dashboard/utils/handlers/dialogActionHandlers";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { productUrl } from "../../../../products/urls";
import OrderDetailsPage from "../../../components/OrderDetailsPage/OrderDetailsPage";
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
import { OrderCommonDialogs } from "../shared/OrderCommonDialogs";

export interface OrderNormalDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: OrderDetailsQueryResult["data"];
  loading: boolean;
  orderAddNote: any;
  orderUpdateNote: PartialMutationProviderOutput<
    OrderNoteUpdateMutation,
    OrderNoteUpdateMutationVariables
  >;
  orderInvoiceRequest: any;
  orderUpdate: PartialMutationProviderOutput<OrderUpdateMutation, OrderUpdateMutationVariables>;
  orderCancel: any;
  orderFulfillmentApprove: PartialMutationProviderOutput<
    OrderFulfillmentApproveMutation,
    OrderFulfillmentApproveMutationVariables
  >;
  orderFulfillmentCancel: any;
  orderFulfillmentUpdateTracking: any;
  orderInvoiceSend: any;
  openModal: OpenModalFunction<OrderUrlDialog, OrderUrlQueryParams>;
  closeModal: CloseModalFunction;
  /** Payment-mode owned slots, supplied by the concrete Legacy/Transaction view. */
  paymentActions?: ReactNode;
  paymentSection?: ReactNode;
}
interface ApprovalState {
  fulfillment: FulfillmentFragment;
  notifyCustomer: boolean;
}

const isInsufficientStockApprovalErrors = (errors: Array<{ code: OrderErrorCode }>): boolean =>
  errors.length > 0 && errors.every(error => error.code === OrderErrorCode.INSUFFICIENT_STOCK);

export const OrderNormalDetails = ({
  id,
  params,
  data,
  loading,
  orderAddNote,
  orderUpdateNote,
  orderInvoiceRequest,
  orderUpdate,
  orderCancel,
  orderFulfillmentApprove,
  orderFulfillmentCancel,
  orderFulfillmentUpdateTracking,
  orderInvoiceSend,
  openModal,
  closeModal,
  paymentActions,
  paymentSection,
}: OrderNormalDetailsProps) => {
  const order = data?.order;
  const shop = data?.shop;
  const navigate = useNavigator();
  const intl = useIntl();
  const [currentApproval, setCurrentApproval] = useState<ApprovalState | null>(null);
  const [stockExceeded, setStockExceeded] = useState(false);
  const previousApproveStatus = useRef<ConfirmButtonTransitionState>(
    orderFulfillmentApprove.opts.status,
  );
  const approvalErrors = orderFulfillmentApprove.opts.data?.orderFulfillmentApprove.errors || [];
  const approveDialogErrors = stockExceeded
    ? []
    : approvalErrors.filter(error => error.code !== OrderErrorCode.INSUFFICIENT_STOCK);

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
            orderNumber: getStringOrPlaceholder(data?.order?.number),
          },
        )}
      />
      <OrderDetailsPage
        onOrderReturn={() => navigate(orderReturnUrl(id))}
        loading={loading}
        errors={errors}
        onNoteUpdateLoading={orderUpdateNote.opts.loading}
        onNoteUpdate={(id, message) =>
          orderUpdateNote.mutate({
            order: id,
            input: {
              message,
            },
          })
        }
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
        shippingMethods={data?.order?.shippingMethods || []}
        onOrderCancel={() => openModal("cancel")}
        onOrderLineShowMetadata={id => openModal("view-order-line-metadata", { id })}
        onOrderShowMetadata={() => openModal("view-order-metadata")}
        onFulfillmentShowMetadata={id => openModal("view-fulfillment-metadata", { id })}
        paymentActions={paymentActions}
        paymentSection={paymentSection}
        onOrderFulfill={() => navigate(orderFulfillUrl(id))}
        onFulfillmentApprove={fulfillmentId =>
          navigate(
            orderUrl(id, withOrderFulfillmentDialog(params, "approve-fulfillment", fulfillmentId)),
          )
        }
        onFulfillmentCancel={fulfillmentId =>
          navigate(
            orderUrl(id, withOrderFulfillmentDialog(params, "cancel-fulfillment", fulfillmentId)),
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
        focusedLineId={params.lineId}
        onFocusedLineChange={lineId =>
          navigate(orderDetailsUrl(id, withOrderLineFocus(params, lineId), order?.status), {
            replace: true,
          })
        }
      />
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
      <OrderFulfillmentApproveDialog
        confirmButtonState={orderFulfillmentApprove.opts.status}
        errors={approveDialogErrors}
        open={params.action === "approve-fulfillment" && !stockExceeded}
        onConfirm={({ notifyCustomer }) => {
          setCurrentApproval({
            fulfillment: order?.fulfillments.find(getById(params.id)),
            notifyCustomer,
          });

          return orderFulfillmentApprove.mutate({
            id: params.id,
            notifyCustomer,
          });
        }}
        onClose={closeModal}
      />
      <OrderFulfillStockExceededDialog
        lines={currentApproval?.fulfillment?.lines}
        formsetData={transformFuflillmentLinesToStockFormsetData(
          currentApproval?.fulfillment?.lines,
          currentApproval?.fulfillment?.warehouse,
        )}
        open={stockExceeded}
        onClose={() => setStockExceeded(false)}
        confirmButtonState={orderFulfillmentApprove.opts.status}
        onSubmit={() => {
          setStockExceeded(false);

          return orderFulfillmentApprove.mutate({
            id: params.id,
            notifyCustomer: currentApproval?.notifyCustomer,
            allowStockToBeExceeded: true,
          });
        }}
      />
    </>
  );
};
