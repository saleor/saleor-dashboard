import { type OrderDetailsFragment } from "@dashboard/graphql";
import { type ReactNode, useState } from "react";

import { LinePriceWaterfallModal } from "../../../components/OrderLinePriceBreakdown/components/LinePriceWaterfallModal";
import { useOrderLinePriceWaterfall } from "../../../components/OrderLinePriceBreakdown/hooks/useOrderLinePriceWaterfall";

/**
 * Line price breakdown modal, opened from a line in the items or draft grid.
 * Returns the opener to hand to the grid and the modal to render.
 */
export const useLinePriceBreakdown = (
  order: OrderDetailsFragment | null | undefined,
): { onShowLinePriceBreakdown: (lineId: string) => void; priceBreakdownModal: ReactNode } => {
  const [lineId, setLineId] = useState<string | null>(null);
  const waterfall = useOrderLinePriceWaterfall({ order, lineId });

  return {
    onShowLinePriceBreakdown: setLineId,
    priceBreakdownModal: waterfall ? (
      <LinePriceWaterfallModal waterfall={waterfall} onClose={() => setLineId(null)} />
    ) : null,
  };
};
