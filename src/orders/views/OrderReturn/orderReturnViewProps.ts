import { type OrderDetailsFragment } from "@dashboard/graphql";

/** Route context handed to each concrete return view. */
export interface OrderReturnViewProps {
  orderId: string;
  order: OrderDetailsFragment | undefined | null;
  loading: boolean;
  prefilledOrderLineId?: string;
}
