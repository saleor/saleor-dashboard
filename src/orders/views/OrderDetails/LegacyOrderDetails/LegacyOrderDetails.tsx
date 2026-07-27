import { OrderStatus } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { LegacyPaymentsApiButtons } from "@dashboard/orders/components/OrderSummary/LegacyPaymentsApiButtons";
import {
  createLegacyRefundNavigationAdapter,
  OrderRefundNavigationProvider,
} from "@dashboard/orders/orderRefundNavigation";
import { type ReactElement, useMemo } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
import { useCommonOrderOperations } from "../operations/useCommonOrderOperations";
import { useLegacyOrderOperations } from "../operations/useLegacyOrderOperations";
import { OrderNormalDetails } from "../OrderNormalDetails";
import { OrderUnconfirmedDetails } from "../OrderUnconfirmedDetails";
import { LegacyPaymentDialogs } from "./LegacyPaymentDialogs";

/**
 * Legacy Payments API order view.
 *
 * Owns the legacy summary actions, the legacy capture/void/mark-as-paid
 * dialogs and the legacy refund destination, and instantiates only common +
 * legacy operation hooks — never transaction hooks.
 *
 * T9: still delegates lifecycle rendering to the shared Normal/Unconfirmed
 * views, which are now payment-neutral. Must not call resolveOrderPaymentMode.
 */
export const LegacyOrderDetails = ({
  handlers,
  ...context
}: NonDraftOrderDetailsProps): ReactElement => {
  const navigate = useNavigator();
  const common = useCommonOrderOperations(handlers);
  const legacy = useLegacyOrderOperations(handlers);
  const order = context.data?.order;
  const { id, params, openModal, closeModal } = context;
  const refundNavigation = useMemo(
    () => (order ? createLegacyRefundNavigationAdapter(order) : null),
    [order],
  );

  const viewProps = {
    ...context,
    ...common,
    paymentActions:
      order && refundNavigation ? (
        <LegacyPaymentsApiButtons
          order={order}
          onCapture={() => openModal("capture")}
          onVoid={() => openModal("void")}
          onRefund={() => navigate(refundNavigation.getNavigation().url)}
          onMarkAsPaid={() => openModal("mark-paid")}
        />
      ) : null,
  };

  const view = (
    <>
      {order?.status === OrderStatus.UNCONFIRMED ? (
        <OrderUnconfirmedDetails {...viewProps} />
      ) : (
        <OrderNormalDetails {...viewProps} />
      )}
      <LegacyPaymentDialogs
        orderId={id}
        order={order}
        params={params}
        onClose={closeModal}
        operations={legacy}
      />
    </>
  );

  if (!refundNavigation) {
    return view;
  }

  return (
    <OrderRefundNavigationProvider adapter={refundNavigation}>{view}</OrderRefundNavigationProvider>
  );
};
