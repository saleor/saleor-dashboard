import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { CardActions } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import OrderCardTitle from "../OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid";
import { useStyles } from "./styles";

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderLineFragment[];
  onFulfill: () => void;
  loading: boolean;
  onShowMetadata: (id: string) => void;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = ({
  showFulfillmentAction,
  notAllowedToFulfillUnpaid,
  onShowMetadata,
  lines,
  onFulfill,
  loading,
}) => {
  const classes = useStyles();

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <DashboardCard>
        <OrderCardTitle withStatus status="unfulfilled" className={classes.cardTitle} />
        <DashboardCard.Content>
          <OrderDetailsDatagrid lines={lines} loading={loading} onShowMetadata={onShowMetadata} />
          {showFulfillmentAction && (
            <CardActions className={classes.actions}>
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
            </CardActions>
          )}
        </DashboardCard.Content>
      </DashboardCard>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
