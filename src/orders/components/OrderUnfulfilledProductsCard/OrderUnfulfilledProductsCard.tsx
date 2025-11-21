import { DashboardCard } from "@dashboard/components/Card";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { PackageIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
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
      <DashboardCard gap={0}>
        <OrderCardTitle
          status="unfulfilled"
          className={classes.cardTitle}
          toolbar={
            showFulfillmentAction && (
              <Box>
                <Button
                  data-test-id="fulfill-button"
                  variant="primary"
                  onClick={onFulfill}
                  disabled={notAllowedToFulfillUnpaid}
                >
                  <PackageIcon size={16} />
                  <FormattedMessage id="/Xwjww" defaultMessage="Fulfill" description="button" />
                </Button>
                {notAllowedToFulfillUnpaid && (
                  <Text color="critical1" size={2} fontWeight="light">
                    <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
                  </Text>
                )}
              </Box>
            )
          }
        />
        <DashboardCard.Content paddingX={0}>
          <OrderDetailsDatagrid
            lines={toLineWithUnfulfilledQuantity(lines)}
            loading={loading}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
          />
          <Box
            backgroundColor={"default1"}
            width="100%"
            height={6}
            borderBottomStyle={"solid"}
            borderBottomWidth={1}
            borderColor={"default1"}
          />
        </DashboardCard.Content>
      </DashboardCard>
    </>
  );
};

export default OrderUnfulfilledProductsCard;
