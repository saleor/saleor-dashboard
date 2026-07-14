import { DashboardCard } from "@dashboard/components/Card";
import { type OrderDetailsFragment, type OrderLineFragment } from "@dashboard/graphql";

import { OrderCardDatagridSeparator } from "../OrderCardTitle/OrderCardDatagridSeparator";
import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
import { type LineReasonDisplay } from "../OrderDetailsDatagrid/datagrid";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid/OrderDetailsDatagrid";
import { OrderLineGroupEnd } from "../OrderLineGroupBottomSeparator/OrderLineGroupBottomSeparator";
import { toLineWithUnfulfilledQuantity } from "./utils";

interface OrderUnfulfilledProductsCardProps {
  lines: OrderLineFragment[];
  order: OrderDetailsFragment;
  lineReasons?: LineReasonDisplay[];
  loading: boolean;
  onOrderLineShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  showBottomSeparator?: boolean;
}

export const OrderUnfulfilledProductsCard = ({
  onOrderLineShowMetadata,
  onShowLinePriceBreakdown,
  lines,
  order,
  lineReasons,
  loading,
  showBottomSeparator = false,
}: OrderUnfulfilledProductsCardProps) => {
  if (!lines.length) {
    return null;
  }

  return (
    <>
      <DashboardCard gap={0}>
        <OrderCardTitle status="unfulfilled" />
        <OrderCardDatagridSeparator />
        <DashboardCard.Content paddingX={0}>
          <OrderDetailsDatagrid
            lines={toLineWithUnfulfilledQuantity(lines)}
            order={order}
            lineReasons={lineReasons}
            lineRowMenuContext={{ scope: "timeline", segment: "unfulfilled" }}
            loading={loading}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
          />
          <OrderLineGroupEnd showBottomSeparator={showBottomSeparator} backgroundColor="default1" />
        </DashboardCard.Content>
      </DashboardCard>
    </>
  );
};
