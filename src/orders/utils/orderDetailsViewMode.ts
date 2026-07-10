export type OrderDetailsViewMode = "timeline" | "matrix";

const ORDER_DETAILS_VIEW_MODE_KEY = "orderDetailsViewMode";

export const getOrderDetailsViewMode = (): OrderDetailsViewMode => {
  const stored = window.localStorage.getItem(ORDER_DETAILS_VIEW_MODE_KEY);

  return stored === "matrix" ? "matrix" : "timeline";
};

export const setOrderDetailsViewMode = (viewMode: OrderDetailsViewMode) => {
  window.localStorage.setItem(ORDER_DETAILS_VIEW_MODE_KEY, viewMode);
};
