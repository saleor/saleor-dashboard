import FormSpacer from "@dashboard/components/FormSpacer";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { OrderSharedType } from "@dashboard/orders/types";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";

interface PickupAnnotationProps {
  order?: OrderSharedType;
}

export const PickupAnnotation: React.FC<PickupAnnotationProps> = ({
  order,
}) => {
  if (order?.deliveryMethod?.__typename === "Warehouse") {
    return (
      <>
        <FormSpacer />
        <Typography variant="caption" color="textSecondary">
          {order?.deliveryMethod?.clickAndCollectOption ===
          WarehouseClickAndCollectOptionEnum.LOCAL ? (
            <FormattedMessage {...messages.orderCustomerFulfillmentLocal} />
          ) : (
            <FormattedMessage {...messages.orderCustomerFulfillmentAll} />
          )}
        </Typography>
      </>
    );
  }
  return null;
};
