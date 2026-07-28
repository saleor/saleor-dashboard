import { type FetchResult } from "@apollo/client";
import {
  type OrderDetailsFragment,
  type OrderDetailsQuery,
  type OrderUpdateMutation,
  useCustomerAddressesQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { OrderCannotCancelOrderDialog } from "@dashboard/orders/components/OrderCannotCancelOrderDialog/OrderCannotCancelOrderDialog";
import { type OrderCustomerAddressesEditDialogOutput } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/types";
import { OrderFulfillmentMetadataDialog } from "@dashboard/orders/components/OrderFulfillmentMetadataDialog/OrderFulfillmentMetadataDialog";
import OrderInvoiceEmailSendDialog from "@dashboard/orders/components/OrderInvoiceEmailSendDialog";
import { OrderLineMetadataDialog } from "@dashboard/orders/components/OrderLineMetadataDialog/OrderLineMetadataDialog";
import { OrderMetadataDialog } from "@dashboard/orders/components/OrderMetadataDialog/OrderMetadataDialog";
import { isAnyAddressEditModalOpen } from "@dashboard/orders/utils/data";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type ReactElement } from "react";

import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import { OrderCancelDialog } from "../../../components/OrderCancelDialog";
import OrderFulfillmentCancelDialog from "../../../components/OrderFulfillmentCancelDialog";
import { OrderFulfillmentTrackingDialog } from "../../../components/OrderFulfillmentTrackingDialog/OrderFulfillmentTrackingDialog";
import { type OrderUrlQueryParams } from "../../../urls";
import { type useCommonOrderOperations } from "../operations/useCommonOrderOperations";

type CommonOperations = ReturnType<typeof useCommonOrderOperations>;

interface OrderCommonDialogsProps {
  orderId: string;
  order: OrderDetailsFragment | null | undefined;
  countries: OrderDetailsQuery["shop"]["countries"] | undefined;
  params: OrderUrlQueryParams;
  onClose: () => void;
  operations: Pick<
    CommonOperations,
    | "orderCancel"
    | "orderUpdate"
    | "orderFulfillmentCancel"
    | "orderFulfillmentUpdateTracking"
    | "orderInvoiceSend"
  >;
}

/**
 * Dialogs every non-draft order has regardless of lifecycle or payment mode.
 *
 * Owns the two lookups only these dialogs need — the customer's saved addresses
 * and the warehouse list — so the lifecycle views neither fetch nor forward
 * them. Lifecycle-specific dialogs (fulfillment approval, draft line editing)
 * stay with their view.
 */
export const OrderCommonDialogs = ({
  orderId,
  order,
  countries,
  params,
  onClose,
  operations,
}: OrderCommonDialogsProps): ReactElement | null => {
  const {
    orderCancel,
    orderUpdate,
    orderFulfillmentCancel,
    orderFulfillmentUpdateTracking,
    orderInvoiceSend,
  } = operations;
  const { data: warehousesData } = useWarehouseListQuery({
    displayLoader: true,
    variables: { first: 30 },
  });
  const { data: customerAddresses, loading: customerAddressesLoading } = useCustomerAddressesQuery({
    variables: { id: order?.user?.id ?? "" },
    skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
  });
  const hasFulfilledFulfillments = order?.fulfillments.some(
    fulfillment => fulfillment.status === "FULFILLED",
  );
  const selectedFulfillment = params.id ? order?.fulfillments.find(getById(params.id)) : undefined;
  const selectedInvoice = params.id
    ? order?.invoices?.find(invoice => invoice.id === params.id)
    : undefined;
  const handleCustomerChangeAddresses = async (
    data: Partial<OrderCustomerAddressesEditDialogOutput>,
  ): Promise<FetchResult<OrderUpdateMutation>> => orderUpdate.mutate({ id: orderId, input: data });

  if (!order || !countries) {
    return null;
  }

  return (
    <>
      <OrderCannotCancelOrderDialog
        onClose={onClose}
        open={params.action === "cancel" && !!hasFulfilledFulfillments}
      />
      <OrderCancelDialog
        confirmButtonState={orderCancel.opts.status}
        errors={orderCancel.opts.data?.orderCancel?.errors || []}
        number={order.number}
        open={params.action === "cancel" && !hasFulfilledFulfillments}
        onClose={onClose}
        onSubmit={() => orderCancel.mutate({ id: orderId })}
      />
      {params.id && (
        <OrderLineMetadataDialog
          open={params.action === "view-order-line-metadata"}
          onClose={onClose}
          lineId={params.id}
          orderId={orderId}
        />
      )}
      <OrderMetadataDialog
        open={params.action === "view-order-metadata"}
        onClose={onClose}
        orderId={orderId}
      />
      {params.id && (
        <OrderFulfillmentMetadataDialog
          open={params.action === "view-fulfillment-metadata"}
          onClose={onClose}
          orderId={orderId}
          fulfillmentId={params.id}
        />
      )}
      <OrderFulfillmentCancelDialog
        confirmButtonState={orderFulfillmentCancel.opts.status}
        errors={orderFulfillmentCancel.opts.data?.orderFulfillmentCancel?.errors || []}
        open={params.action === "cancel-fulfillment"}
        warehouses={mapEdgesToItems(warehousesData?.warehouses) || []}
        fulfillmentStatus={selectedFulfillment?.status}
        defaultWarehouseId={selectedFulfillment?.warehouse?.id}
        onConfirm={variables =>
          orderFulfillmentCancel.mutate({ id: params.id ?? "", input: variables })
        }
        onClose={onClose}
      />
      <OrderFulfillmentTrackingDialog
        confirmButtonState={orderFulfillmentUpdateTracking.opts.status}
        errors={
          orderFulfillmentUpdateTracking.opts.data?.orderFulfillmentUpdateTracking?.errors || []
        }
        open={params.action === "edit-fulfillment"}
        trackingNumber={selectedFulfillment?.trackingNumber}
        onConfirm={variables =>
          orderFulfillmentUpdateTracking.mutate({
            id: params.id ?? "",
            input: { ...variables, notifyCustomer: true },
          })
        }
        onClose={onClose}
      />
      <OrderInvoiceEmailSendDialog
        confirmButtonState={orderInvoiceSend.opts.status}
        // Both lifecycle views read `invoiceSendEmail` here, a field the
        // InvoiceEmailSend mutation does not return; under @ts-strict-ignore that
        // silently resolved to undefined, so these errors were never shown.
        errors={orderInvoiceSend.opts.data?.invoiceSendNotification?.errors || []}
        open={params.action === "invoice-send"}
        invoice={selectedInvoice}
        onClose={onClose}
        onSend={() => orderInvoiceSend.mutate({ id: params.id ?? "" })}
      />
      <OrderAddressFields
        action={params?.action}
        orderShippingAddress={order.shippingAddress}
        orderBillingAddress={order.billingAddress}
        customerAddressesLoading={customerAddressesLoading}
        isDraft={false}
        countries={countries}
        customer={customerAddresses?.user ?? null}
        onClose={onClose}
        onConfirm={handleCustomerChangeAddresses}
        confirmButtonState={orderUpdate.opts.status}
        errors={orderUpdate.opts.data?.orderUpdate?.errors ?? []}
      />
    </>
  );
};
