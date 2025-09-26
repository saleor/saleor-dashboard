import { FulfillmentFragment } from "@dashboard/graphql";
import { Button } from "@saleor/macaw-ui-next";
import { Truck } from "lucide-react";
import { useIntl } from "react-intl";

export const OrderFulfillmentTrackingNumberButton = ({
  fulfillment,
}: {
  fulfillment: FulfillmentFragment;
}) => {
  const intl = useIntl();

  return fulfillment.trackingNumber ? (
    <Button variant="secondary">
      {intl.formatMessage({ id: "HRZD/o", defaultMessage: "Change Tracking" })}
    </Button>
  ) : (
    <Button>
      <Truck size={17} />
      {intl.formatMessage({ id: "+/ncVS", defaultMessage: "Add Tracking" })}
    </Button>
  );
};
