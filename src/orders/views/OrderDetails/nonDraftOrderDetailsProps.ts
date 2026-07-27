import { type OrderNormalDetailsProps } from "./OrderNormalDetails";
import { type OrderUnconfirmedDetailsProps } from "./OrderUnconfirmedDetails";

/**
 * Temporary (T5): the union of props the existing Normal/Unconfirmed lifecycle
 * views need, so the new Legacy/Transaction payment-mode seam can delegate to
 * them unchanged. This type shrinks as payment-mode ownership (mutations,
 * dialogs, summary buttons) moves into the concrete views in T6–T10.
 */
export type NonDraftOrderDetailsProps = OrderNormalDetailsProps & OrderUnconfirmedDetailsProps;
