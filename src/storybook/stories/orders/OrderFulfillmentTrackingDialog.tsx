import { OrderErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderFulfillmentTrackingDialog, {
  OrderFulfillmentTrackingDialogProps,
} from "../../../orders/components/OrderFulfillmentTrackingDialog";
import Decorator from "../../Decorator";

const props: OrderFulfillmentTrackingDialogProps = {
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  trackingNumber: "21kn7526v1",
};

storiesOf("Orders / OrderFulfillmentTrackingDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillmentTrackingDialog {...props} />)
  .add("errors", () => (
    <OrderFulfillmentTrackingDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.GRAPHQL_ERROR,
          field: null,
          addressType: null,
          message: "Graphql Error",
          orderLines: null,
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.INVALID,
          field: "trackingNumber",
          addressType: null,
          message: "Tracking number field invalid",
          orderLines: null,
        },
      ]}
    />
  ));
