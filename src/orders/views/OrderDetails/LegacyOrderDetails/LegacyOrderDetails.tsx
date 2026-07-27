import { OrderStatus } from "@dashboard/graphql";
import { type ReactElement } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
import { OrderNormalDetails } from "../OrderNormalDetails";
import { OrderUnconfirmedDetails } from "../OrderUnconfirmedDetails";

/**
 * Legacy Payments API order view.
 *
 * T5: temporarily delegates to the shared Normal/Unconfirmed lifecycle views
 * unchanged, so the payment-mode split stays behavior-preserving. Legacy-only
 * ownership (capture/void, payment dialogs, legacy summary buttons) moves here
 * in T6–T10. Must not call resolveOrderPaymentMode.
 */
export const LegacyOrderDetails = (props: NonDraftOrderDetailsProps): ReactElement =>
  props.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...props} />
  ) : (
    <OrderNormalDetails {...props} />
  );
