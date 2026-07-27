import { OrderStatus } from "@dashboard/graphql";
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
 * Instantiates only common + legacy operation hooks — never transaction hooks.
 * The transaction props the shared lifecycle views still require are filled with
 * inert no-op mutations (T10 removes this once those views are payment-neutral).
 *
 * T7: still delegates lifecycle rendering to the shared Normal/Unconfirmed
 * views. Must not call resolveOrderPaymentMode.
 */
export const LegacyOrderDetails = ({
  handlers,
  ...context
}: NonDraftOrderDetailsProps): ReactElement => {
  const common = useCommonOrderOperations(handlers);
  const legacy = useLegacyOrderOperations(handlers);

  const viewProps = {
    ...context,
    ...common,
    ...legacy,
    // Legacy orders never open transaction dialogs; inert placeholders satisfy
    // the shared views' prop contract without creating transaction hooks.
    orderTransactionAction: noopOrderMutation(),
    orderAddManualTransaction: noopOrderMutation(),
  };

  return context.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...viewProps} />
  ) : (
    <OrderNormalDetails {...viewProps} />
  );
};
