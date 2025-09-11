import { FulfillmentStatus } from "@dashboard/graphql";
import { EraserIcon, PackageIcon, ReplaceIcon, SignatureIcon } from "lucide-react";

import { OrderFulfillmentRefundedStatusIcon } from "../icons/order-fulfillment-refunded-status-icon";
import { OrderFulfillmentReturnedStatusIcon } from "../icons/order-fulfillment-returned-status-icon";

export const OrderFulfillmentStatusIcon = ({ status }: { status: FulfillmentStatus }) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color="oklch(78.7% 0.203 153deg)" size={17} />;
    case FulfillmentStatus.REFUNDED:
      return <OrderFulfillmentRefundedStatusIcon size={17} />;
    case FulfillmentStatus.RETURNED:
      return <OrderFulfillmentReturnedStatusIcon size={17} />;
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon size={17} />;
    case FulfillmentStatus.CANCELED:
      return <EraserIcon color="oklch(70.9% 0.183 23deg)" size={17} />;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return <SignatureIcon size={17} />;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return (
        <>
          <OrderFulfillmentRefundedStatusIcon size={17} />
          <ReplaceIcon size={17} />
        </>
      );
    default:
      return null;
  }
};
