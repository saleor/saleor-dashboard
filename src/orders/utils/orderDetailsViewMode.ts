import { type OrderDetailsViewMode } from "@dashboard/types";

export const LEGACY_ORDER_DETAILS_VIEW_MODE_KEY = "orderDetailsViewMode";

export const parseOrderDetailsViewMode = (
  value: string | null | undefined,
): OrderDetailsViewMode => (value === "matrix" ? "matrix" : "timeline");
