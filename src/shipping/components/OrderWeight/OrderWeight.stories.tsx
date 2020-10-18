import Decorator from "@saleor/storybook//Decorator";
import { ShippingErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderWeight, { OrderWeightProps } from "./OrderWeight";

const props: OrderWeightProps = {
  disabled: false,
  errors: [],
  maxValue: "2",
  minValue: "1",
  noLimits: false,
  onChange: () => undefined
};

storiesOf("Shipping / Order weight rates", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderWeight {...props} />)
  .add("loading", () => <OrderWeight {...props} disabled={true} />)
  .add("new", () => <OrderWeight {...props} maxValue="" minValue="" />)
  .add("form errors", () => (
    <OrderWeight
      {...props}
      errors={["minimumOrderWeight", "maximumOrderWeight"].map(field => ({
        __typename: "ShippingError",
        code: ShippingErrorCode.INVALID,
        field
      }))}
    />
  ));
