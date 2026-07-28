import { CardSpacer } from "@dashboard/components/CardSpacer";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type OrderDetailsFragment,
  type OrderErrorFragment,
  OrderStatus,
} from "@dashboard/graphql";
import { Divider } from "@saleor/macaw-ui-next";
import { type ReactElement, type ReactNode } from "react";

import OrderCustomer from "../../../components/OrderCustomer";
import OrderCustomerNote from "../../../components/OrderCustomerNote";

interface OrderDetailsSidebarProps {
  order: OrderDetailsFragment;
  errors: OrderErrorFragment[];
  onBillingAddressEdit: () => void;
  onShippingAddressEdit: () => void;
  onProfileView: () => void;
  /** Invoice list — only lifecycles that expose invoices supply it. */
  invoices?: ReactNode;
}

/**
 * Order details right sidebar: customer/addresses, an optional invoice list,
 * the customer note and the app widgets mounted on this page.
 */
export const OrderDetailsSidebar = ({
  order,
  errors,
  onBillingAddressEdit,
  onShippingAddressEdit,
  onProfileView,
  invoices,
}: OrderDetailsSidebarProps): ReactElement => {
  const { ORDER_DETAILS_WIDGETS } = useExtensions(extensionMountPoints.ORDER_DETAILS);

  return (
    <>
      <OrderCustomer
        canEditAddresses={order.status !== OrderStatus.CANCELED}
        canEditCustomer={false}
        order={order}
        errors={errors}
        onBillingAddressEdit={onBillingAddressEdit}
        onShippingAddressEdit={onShippingAddressEdit}
        onProfileView={onProfileView}
      />
      <CardSpacer />
      <Divider />
      {invoices && (
        <>
          {invoices}
          <CardSpacer />
          <Divider />
        </>
      )}
      <OrderCustomerNote note={order.customerNote} />
      {ORDER_DETAILS_WIDGETS.length > 0 && (
        <>
          <CardSpacer />
          <Divider />
          <AppWidgets extensions={ORDER_DETAILS_WIDGETS} params={{ orderId: order.id }} />
        </>
      )}
    </>
  );
};
