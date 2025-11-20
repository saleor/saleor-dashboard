// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CreateManualTransactionCaptureMutation,
  CreateManualTransactionCaptureMutationVariables,
  FulfillmentFragment,
  FulfillmentStatus,
  OrderDetailsWithMetadataQueryResult,
  OrderFulfillmentApproveMutation,
  OrderFulfillmentApproveMutationVariables,
  OrderNoteUpdateMutation,
  OrderNoteUpdateMutationVariables,
  OrderTransactionRequestActionMutation,
  OrderTransactionRequestActionMutationVariables,
  OrderUpdateMutation,
  OrderUpdateMutationVariables,
  useCustomerAddressesQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  extractMutationErrors,
  getById,
  getMutationState,
  getStringOrPlaceholder,
} from "@dashboard/misc";
import OrderCannotCancelOrderDialog from "@dashboard/orders/components/OrderCannotCancelOrderDialog";
import { OrderCustomerAddressesEditDialogOutput } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/types";
import OrderFulfillmentApproveDialog from "@dashboard/orders/components/OrderFulfillmentApproveDialog";
import { OrderFulfillmentMetadataDialog } from "@dashboard/orders/components/OrderFulfillmentMetadataDialog/OrderFulfillmentMetadataDialog";
import OrderFulfillStockExceededDialog from "@dashboard/orders/components/OrderFulfillStockExceededDialog";
import OrderInvoiceEmailSendDialog from "@dashboard/orders/components/OrderInvoiceEmailSendDialog";
import { OrderLineMetadataDialog } from "@dashboard/orders/components/OrderLineMetadataDialog/OrderLineMetadataDialog";
import { OrderManualTransactionDialog } from "@dashboard/orders/components/OrderManualTransactionDialog";
import { OrderMetadataDialog } from "@dashboard/orders/components/OrderMetadataDialog/OrderMetadataDialog";
import { OrderRefundDialog } from "@dashboard/orders/components/OrderRefundDialog/OrderRefundDialog";
import { OrderTransactionActionDialog } from "@dashboard/orders/components/OrderTransactionActionDialog/OrderTransactionActionDialog";
import {
  isAnyAddressEditModalOpen,
  transformFuflillmentLinesToStockFormsetData,
} from "@dashboard/orders/utils/data";
import { PartialMutationProviderOutput } from "@dashboard/types";
import {
  CloseModalFunction,
  OpenModalFunction,
} from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { productUrl } from "../../../../products/urls";
import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import OrderCancelDialog from "../../../components/OrderCancelDialog";
import OrderDetailsPage from "../../../components/OrderDetailsPage/OrderDetailsPage";
import OrderFulfillmentCancelDialog from "../../../components/OrderFulfillmentCancelDialog";
import OrderFulfillmentTrackingDialog from "../../../components/OrderFulfillmentTrackingDialog";
import OrderMarkAsPaidDialog from "../../../components/OrderMarkAsPaidDialog/OrderMarkAsPaidDialog";
import OrderPaymentDialog from "../../../components/OrderPaymentDialog";
import OrderPaymentVoidDialog from "../../../components/OrderPaymentVoidDialog";
import {
  orderFulfillUrl,
  orderManualTransactionRefundUrl,
  orderPaymentRefundUrl,
  orderReturnUrl,
  orderTransactionRefundUrl,
  orderUrl,
  OrderUrlDialog,
  OrderUrlQueryParams,
} from "../../../urls";

interface OrderNormalDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: OrderDetailsWithMetadataQueryResult["data"];
  loading: boolean;
  orderAddNote: any;
  orderUpdateNote: PartialMutationProviderOutput<
    OrderNoteUpdateMutation,
    OrderNoteUpdateMutationVariables
  >;
  orderInvoiceRequest: any;
  handleSubmit: any;
  orderUpdate: PartialMutationProviderOutput<OrderUpdateMutation, OrderUpdateMutationVariables>;
  orderCancel: any;
  orderPaymentMarkAsPaid: any;
  orderVoid: any;
  orderPaymentCapture: any;
  orderFulfillmentApprove: PartialMutationProviderOutput<
    OrderFulfillmentApproveMutation,
    OrderFulfillmentApproveMutationVariables
  >;
  orderFulfillmentCancel: any;
  orderFulfillmentUpdateTracking: any;
  orderInvoiceSend: any;
  orderTransactionAction: PartialMutationProviderOutput<
    OrderTransactionRequestActionMutation,
    OrderTransactionRequestActionMutationVariables
  >;
  orderAddManualTransaction: PartialMutationProviderOutput<
    CreateManualTransactionCaptureMutation,
    CreateManualTransactionCaptureMutationVariables
  >;
  updateMetadataOpts: any;
  updatePrivateMetadataOpts: any;
  openModal: OpenModalFunction<OrderUrlDialog, OrderUrlQueryParams>;
  closeModal: CloseModalFunction;
}
interface ApprovalState {
  fulfillment: FulfillmentFragment;
  notifyCustomer: boolean;
}

export const OrderNormalDetails = ({
  id,
  params,
  data,
  loading,
  orderAddNote,
  orderUpdateNote,
  orderInvoiceRequest,
  handleSubmit,
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
  updateMetadataOpts,
  updatePrivateMetadataOpts,
  openModal,
  closeModal,
}: OrderNormalDetailsProps) => {
  const order = data?.order;
  const shop = data?.shop;
  const navigate = useNavigator();
  const { data: warehousesData } = useWarehouseListQuery({
    displayLoader: true,
    variables: {
      first: 30,
    },
  });
  const warehouses = mapEdgesToItems(warehousesData?.warehouses);
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
  const [transactionReference, setTransactionReference] = useState("");
  const [currentApproval, setCurrentApproval] = useState<ApprovalState | null>(null);
  const [stockExceeded, setStockExceeded] = useState(false);
  const approvalErrors = orderFulfillmentApprove.opts.data?.orderFulfillmentApprove.errors || [];

  useEffect(() => {
    if (approvalErrors.length && approvalErrors.every(err => err.code === "INSUFFICIENT_STOCK")) {
      setStockExceeded(true);
    }
  }, [approvalErrors]);

  const errors = orderUpdate.opts.data?.orderUpdate.errors || [];

  const hasOrderFulfillmentsFulfilled = order?.fulfillments.some(
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
            orderNumber: getStringOrPlaceholder(data?.order?.number),
          },
        )}
      />
      <OrderDetailsPage
        onOrderReturn={() => navigate(orderReturnUrl(id))}
        loading={loading || updateMetadataOpts.loading || updatePrivateMetadataOpts.loading}
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
        saveButtonBarState={getMutationState(
          updateMetadataOpts.called || updatePrivateMetadataOpts.called,
          updateMetadataOpts.loading || updatePrivateMetadataOpts.loading,
          [
            ...(updateMetadataOpts.data?.deleteMetadata.errors || []),
            ...(updateMetadataOpts.data?.updateMetadata.errors || []),
            ...(updatePrivateMetadataOpts.data?.deletePrivateMetadata.errors || []),
            ...(updatePrivateMetadataOpts.data?.updatePrivateMetadata.errors || []),
          ],
        )}
        shippingMethods={data?.order?.shippingMethods || []}
        onOrderCancel={() => openModal("cancel")}
        onOrderLineShowMetadata={id => openModal("view-order-line-metadata", { id })}
        onOrderShowMetadata={() => openModal("view-order-metadata")}
        onFulfillmentShowMetadata={id => openModal("view-fulfillment-metadata", { id })}
        onTransactionAction={(id, action) =>
          openModal("transaction-action", {
            type: action,
            id,
            action: "transaction-action",
          })
        }
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
        onRefundAdd={() => openModal("add-refund")}
        onSubmit={handleSubmit}
      />
      <OrderCannotCancelOrderDialog
        onClose={closeModal}
        open={params.action === "cancel" && hasOrderFulfillmentsFulfilled}
      />
      <OrderCancelDialog
        confirmButtonState={orderCancel.opts.status}
        errors={orderCancel.opts.data?.orderCancel.errors || []}
        number={order?.number}
        open={params.action === "cancel" && !hasOrderFulfillmentsFulfilled}
        onClose={closeModal}
        onSubmit={() =>
          orderCancel.mutate({
            id,
          })
        }
      />
      <OrderTransactionActionDialog
        confirmButtonState={orderTransactionAction.opts.status}
        onClose={closeModal}
        open={params.action === "transaction-action"}
        action={params.type}
        onSubmit={() =>
          orderTransactionAction
            .mutate({
              action: params.type,
              transactionId: params.id,
            })
            .finally(() => closeModal())
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
        order={data?.order}
      />
      <OrderFulfillmentMetadataDialog
        open={params.action === "view-fulfillment-metadata"}
        onClose={closeModal}
        fulfillment={data?.order?.fulfillments?.find(f => f.id === params.id)}
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
        handleTransactionReference={({ target }) => setTransactionReference(target.value)}
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
        errors={orderFulfillmentApprove.opts.data?.orderFulfillmentApprove.errors || []}
        open={params.action === "approve-fulfillment"}
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
        lines={currentApproval?.fulfillment.lines}
        formsetData={transformFuflillmentLinesToStockFormsetData(
          currentApproval?.fulfillment.lines,
          currentApproval?.fulfillment.warehouse,
        )}
        open={stockExceeded}
        onClose={() => setStockExceeded(false)}
        confirmButtonState="default"
        onSubmit={() => {
          setStockExceeded(false);

          return orderFulfillmentApprove.mutate({
            id: params.id,
            notifyCustomer: currentApproval?.notifyCustomer,
            allowStockToBeExceeded: true,
          });
        }}
      />
      <OrderFulfillmentCancelDialog
        confirmButtonState={orderFulfillmentCancel.opts.status}
        errors={orderFulfillmentCancel.opts.data?.orderFulfillmentCancel.errors || []}
        open={params.action === "cancel-fulfillment"}
        warehouses={warehouses || []}
        fulfillmentStatus={order?.fulfillments.find(getById(params.id))?.status}
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
        errors={orderInvoiceSend.opts.data?.invoiceSendEmail?.errors || []}
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
          orderAddManualTransaction.opts?.data?.transactionCreate?.errors?.[0]?.message
        }
        currency={data?.order?.totalBalance?.currency}
        onAddTransaction={({ amount, description, pspReference }) =>
          orderAddManualTransaction.mutate({
            currency: data?.order?.totalBalance?.currency,
            orderId: id,
            amount,
            description,
            pspReference,
          })
        }
      />
      <OrderRefundDialog
        open={params.action === "add-refund"}
        onClose={closeModal}
        onStandardRefund={() => navigate(orderTransactionRefundUrl(id), { replace: true })}
        onManualRefund={() => navigate(orderManualTransactionRefundUrl(id), { replace: true })}
      />

      <OrderAddressFields
        action={params?.action}
        orderShippingAddress={order?.shippingAddress}
        orderBillingAddress={order?.billingAddress}
        customerAddressesLoading={customerAddressesLoading}
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
