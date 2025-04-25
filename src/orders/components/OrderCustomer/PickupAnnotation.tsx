import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderDetailsFragment, WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";

interface PickupAnnotationProps {
  order?: OrderDetailsFragment;
}

export const PickupAnnotation: React.FC<PickupAnnotationProps> = ({ order }) => {
  if (order?.deliveryMethod?.__typename === "Warehouse") {
    return (
      <>
        <FormSpacer />
        <Text size={2} fontWeight="light" color="default2">
          {order?.deliveryMethod?.clickAndCollectOption ===
          WarehouseClickAndCollectOptionEnum.LOCAL ? (
            <FormattedMessage {...messages.orderCustomerFulfillmentLocal} />
          ) : (
            <FormattedMessage {...messages.orderCustomerFulfillmentAll} />
          )}
        </Text>
      </>
    );
  }

  return null;
};
