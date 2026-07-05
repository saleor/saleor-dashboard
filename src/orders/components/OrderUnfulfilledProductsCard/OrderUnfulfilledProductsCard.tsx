import { DashboardCard } from "@dashboard/components/Card";
import { type OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { PackageIcon } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderCardDatagridSeparator } from "../OrderCardTitle/OrderCardDatagridSeparator";
import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid/OrderDetailsDatagrid";
import { OrderLineGroupEnd } from "../OrderLineGroupBottomSeparator/OrderLineGroupBottomSeparator";
import { toLineWithUnfulfilledQuantity } from "./utils";

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderLineFragment[];
  onFulfill: () => void;
  loading: boolean;
  onOrderLineShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  showBottomSeparator?: boolean;
}

export const OrderUnfulfilledProductsCard = ({
  showFulfillmentAction,
  notAllowedToFulfillUnpaid,
  onOrderLineShowMetadata,
  onShowLinePriceBreakdown,
  lines,
  onFulfill,
  loading,
  showBottomSeparator = false,
}: OrderUnfulfilledProductsCardProps) => {
  const intl = useIntl();

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <DashboardCard gap={0}>
        <OrderCardTitle
          status="unfulfilled"
          toolbar={
            showFulfillmentAction && (
              <Box>
                <Button
                  data-test-id="fulfill-button"
                  variant="primary"
                  onClick={onFulfill}
                  disabled={notAllowedToFulfillUnpaid}
                  title={
                    notAllowedToFulfillUnpaid
                      ? intl.formatMessage(commonMessages.cannotFullfillUnpaidOrder)
                      : undefined
                  }
                >
                  <PackageIcon size={16} />
                  <FormattedMessage id="/Xwjww" defaultMessage="Fulfill" description="button" />
                </Button>
              </Box>
            )
          }
        />
        <OrderCardDatagridSeparator />
        <DashboardCard.Content paddingX={0}>
          <OrderDetailsDatagrid
            lines={toLineWithUnfulfilledQuantity(lines)}
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
