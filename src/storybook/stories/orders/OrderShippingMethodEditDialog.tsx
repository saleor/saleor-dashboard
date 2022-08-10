import { OrderErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderShippingMethodEditDialog, {
  OrderShippingMethodEditDialogProps,
} from "../../../orders/components/OrderShippingMethodEditDialog";
import { order as orderFixture } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture("");
const props: OrderShippingMethodEditDialogProps = {
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true,
  shippingMethod: null,
  shippingMethods: order.shippingMethods,
};

storiesOf("Orders / OrderShippingMethodEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderShippingMethodEditDialog {...props} />)
  .add("errors", () => (
    <OrderShippingMethodEditDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.SHIPPING_METHOD_NOT_APPLICABLE,
          field: "shippingMethod",
          addressType: null,
          message: "Shipping method not applicable",
          orderLines: null,
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.GRAPHQL_ERROR,
          field: null,
          addressType: null,
          message: "Graphql error",
          orderLines: null,
        },
      ]}
    />
  ));
