import { type OrderDetailsFragment } from "@dashboard/graphql";
import { useMemo } from "react";

import { buildLineWaterfall } from "../utils/buildLineWaterfall";
import { type LinePriceWaterfall } from "../utils/types";

interface UseOrderLinePriceWaterfallProps {
  order: OrderDetailsFragment | null | undefined;
  lineId: string | null | undefined;
}

/**
 * Returns the typed price waterfall for a single order line, or `null` when
 * either the order or the line is not available. Memoized so a re-render of
 * the order details page doesn't recompute unless the underlying order or
 * the targeted line id change.
 */
export function useOrderLinePriceWaterfall({
  order,
  lineId,
}: UseOrderLinePriceWaterfallProps): LinePriceWaterfall | null {
  return useMemo(() => {
    if (!order || !lineId) return null;

    const line = order.lines.find(l => l.id === lineId);

    if (!line) return null;

    return buildLineWaterfall(line, order);
  }, [order, lineId]);
}
