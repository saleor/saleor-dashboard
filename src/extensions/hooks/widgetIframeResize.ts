import type { DispatchResponseEvent, WidgetResize } from "@saleor/app-sdk/app-bridge";

/** Height used before (and if) an app reports its own. Prevents collapse to the ~150px iframe default. */
export const WIDGET_DEFAULT_HEIGHT = 200;

/** Upper bound so a buggy or hostile app cannot blow up the Dashboard layout. */
export const WIDGET_MAX_HEIGHT = 5000;

/** Matches `@saleor/app-sdk` `actions.WidgetResize` height rules. */
export const isPositiveFiniteWidgetHeight = (height: number): boolean =>
  Number.isFinite(height) && height > 0;

export const isWidgetResizeAction = (data: unknown): data is WidgetResize => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const action = data as Partial<WidgetResize>;
  const { height, actionId } = action.payload ?? {};

  return (
    action.type === "widgetResize" &&
    typeof actionId === "string" &&
    typeof height === "number" &&
    isPositiveFiniteWidgetHeight(height)
  );
};

export const clampWidgetHeight = (height: number) => Math.min(Math.ceil(height), WIDGET_MAX_HEIGHT);

export const applyWidgetHeightToFrame = (frameEl: HTMLIFrameElement, height: number) => {
  if (!isPositiveFiniteWidgetHeight(height)) {
    return;
  }

  frameEl.style.height = `${clampWidgetHeight(height)}px`;
};

export const createWidgetResizeOkResponse = (actionId: string): DispatchResponseEvent => ({
  type: "response",
  payload: {
    actionId,
    ok: true,
  },
});
