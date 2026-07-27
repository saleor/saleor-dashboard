import { OrderStatus } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { LegacyPaymentsApiButtons } from "@dashboard/orders/components/OrderSummary/LegacyPaymentsApiButtons";
import { getOrderRefundNavigation } from "@dashboard/orders/utils/getOrderRefundNavigation";
import { type ReactElement } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
import { noopOrderMutation } from "../operations/noopOrderMutation";
import { useCommonOrderOperations } from "../operations/useCommonOrderOperations";
import { useLegacyOrderOperations } from "../operations/useLegacyOrderOperations";
import { OrderNormalDetails } from "../OrderNormalDetails";
import { OrderUnconfirmedDetails } from "../OrderUnconfirmedDetails";

/**
 * Legacy Payments API order view.
 *
 * Instantiates only common + legacy operation hooks — never transaction hooks —
 * and owns the legacy summary actions. The transaction props the shared
 * lifecycle views still require are filled with inert no-op mutations (T10
 * removes this once those views are payment-neutral).
 *
 * T8: still delegates lifecycle rendering to the shared Normal/Unconfirmed
 * views. Must not call resolveOrderPaymentMode.
 */
export const LegacyOrderDetails = ({
  handlers,
  ...context
}: NonDraftOrderDetailsProps): ReactElement => {
  const navigate = useNavigator();
  const common = useCommonOrderOperations(handlers);
  const legacy = useLegacyOrderOperations(handlers);
  const order = context.data?.order;
  const { openModal } = context;

  const viewProps = {
    ...context,
    ...common,
    ...legacy,
    // Legacy orders never open transaction dialogs; inert placeholders satisfy
    // the shared views' prop contract without creating transaction hooks.
    orderTransactionAction: noopOrderMutation(),
    orderAddManualTransaction: noopOrderMutation(),
    paymentActions: order ? (
      <LegacyPaymentsApiButtons
        order={order}
        onCapture={() => openModal("capture")}
        onVoid={() => openModal("void")}
        onRefund={() => navigate(getOrderRefundNavigation(order).url)}
        onMarkAsPaid={() => openModal("mark-paid")}
      />
    ) : null,
  };

  return context.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...viewProps} />
  ) : (
    <OrderNormalDetails {...viewProps} />
  );
};
