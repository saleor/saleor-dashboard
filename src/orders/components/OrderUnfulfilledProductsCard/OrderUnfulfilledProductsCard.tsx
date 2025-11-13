import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import OrderCardTitle from "../OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid/OrderDetailsDatagrid";
import { useStyles } from "./styles";
import { toLineWithUnfulfilledQuantity } from "./utils";

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderLineFragment[];
  onFulfill: () => void;
  loading: boolean;
  onOrderLineShowMetadata: (id: string) => void;
}

const OrderUnfulfilledProductsCard = ({
  showFulfillmentAction,
  notAllowedToFulfillUnpaid,
  onOrderLineShowMetadata,
  lines,
  onFulfill,
  loading,
}: OrderUnfulfilledProductsCardProps) => {
  const classes = useStyles();

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <DashboardCard>
        <OrderCardTitle withStatus status="unfulfilled" className={classes.cardTitle} />
        <DashboardCard.Content paddingX={0}>
          <OrderDetailsDatagrid
            lines={toLineWithUnfulfilledQuantity(lines)}
            loading={loading}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
          />
          {showFulfillmentAction && (
            <DashboardCard.BottomActions justifyContent="flex-end">
              <Button
                data-test-id="fulfill-button"
                variant="primary"
                onClick={onFulfill}
                disabled={notAllowedToFulfillUnpaid}
              >
                <FormattedMessage id="/Xwjww" defaultMessage="Fulfill" description="button" />
              </Button>
              {notAllowedToFulfillUnpaid && (
                <Text color="critical1" size={2} fontWeight="light">
                  <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
                </Text>
              )}
            </DashboardCard.BottomActions>
          )}
        </DashboardCard.Content>
      </DashboardCard>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
