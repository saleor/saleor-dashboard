import { FulfillmentStatus } from "@dashboard/graphql";
import { Banknote, PackageIcon, ReplaceIcon } from "lucide-react";
import React from "react";

export const OrderFulfillmentStatusIcon = ({ status }: { status: FulfillmentStatus }) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color="oklch(78.7% 0.203 153deg)" size={17} />;
    case FulfillmentStatus.REFUNDED:
      return <Banknote color="oklch(61.4% 0.21 258deg)" size={17} />;
    case FulfillmentStatus.RETURNED:
      return <PackageIcon color="oklch(67.1% 0.176 256deg)" size={17} />;
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon size={17} />;
    default:
      return null;
  }
};
