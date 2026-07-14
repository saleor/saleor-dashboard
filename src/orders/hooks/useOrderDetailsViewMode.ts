import useListSettings from "@dashboard/hooks/useListSettings";
import {
  LEGACY_ORDER_DETAILS_VIEW_MODE_KEY,
  parseOrderDetailsViewMode,
} from "@dashboard/orders/utils/orderDetailsViewMode";
import {
  ListViews,
  type OrderDetailsListSettings,
  type OrderDetailsViewMode,
} from "@dashboard/types";
import { useCallback, useEffect } from "react";

type UpdateOrderDetailsListSettings = <T extends keyof OrderDetailsListSettings>(
  key: T,
  value: OrderDetailsListSettings[T],
) => void;

export const useOrderDetailsViewMode = () => {
  const { settings, updateListSettings } = useListSettings(ListViews.ORDER_DETAILS_LIST);
  const orderDetailsSettings = settings as OrderDetailsListSettings;
  const updateOrderDetailsSettings = updateListSettings as UpdateOrderDetailsListSettings;

  useEffect(
    function migrateLegacyOrderDetailsViewMode() {
      const legacyValue = window.localStorage.getItem(LEGACY_ORDER_DETAILS_VIEW_MODE_KEY);

      if (!legacyValue) {
        return;
      }

      updateOrderDetailsSettings("viewMode", parseOrderDetailsViewMode(legacyValue));
      window.localStorage.removeItem(LEGACY_ORDER_DETAILS_VIEW_MODE_KEY);
    },
    [updateOrderDetailsSettings],
  );

  const viewMode: OrderDetailsViewMode = orderDetailsSettings.viewMode ?? "timeline";
  const showCanceledFulfillments = orderDetailsSettings.showCanceledFulfillments ?? false;

  const setViewMode = useCallback(
    (mode: OrderDetailsViewMode) => {
      updateOrderDetailsSettings("viewMode", mode);
    },
    [updateOrderDetailsSettings],
  );
  const setShowCanceledFulfillments = useCallback(
    (value: boolean) => {
      updateOrderDetailsSettings("showCanceledFulfillments", value);
    },
    [updateOrderDetailsSettings],
  );

  return { viewMode, setViewMode, showCanceledFulfillments, setShowCanceledFulfillments };
};
