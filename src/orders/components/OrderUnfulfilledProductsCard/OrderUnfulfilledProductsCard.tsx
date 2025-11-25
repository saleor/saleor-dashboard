import { DashboardCard } from "@dashboard/components/Card";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { PackageIcon } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

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
  const intl = useIntl();

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
