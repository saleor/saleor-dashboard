import { FulfillmentStatus } from "@dashboard/graphql";
import { Banknote, PackageIcon, ReplaceIcon } from "lucide-react";
import React from "react";

export const OrderFulfillmentStatusIcon = ({ status }: { status: FulfillmentStatus }) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color="#02DD77" size={17} />;
    case FulfillmentStatus.REFUNDED:
      return <Banknote color="#1C7EFF" size={17} />;
    case FulfillmentStatus.RETURNED:
      return <PackageIcon color="#4395FF" size={17} />;
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon size={17} />;
    default:
      return null;
  }
};
