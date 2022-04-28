import { ShippingErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import OrderWeight, { OrderWeightProps } from "./OrderWeight";

const props: OrderWeightProps = {
  disabled: false,
  errors: [],
  maxValue: "2",
  minValue: "1",
  orderValueRestricted: true,
  onChange: () => undefined
};

export default {
  title: "Shipping / Order weight rates",
  decorators: [Decorator]
};

export const Default = () => <OrderWeight {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <OrderWeight {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};

export const New = () => <OrderWeight {...props} maxValue="" minValue="" />;

New.story = {
  name: "new"
};

export const FormErrors = () => (
  <OrderWeight
    {...props}
    errors={["minimumOrderWeight", "maximumOrderWeight"].map(field => ({
      __typename: "ShippingError",
      code: ShippingErrorCode.INVALID,
      field,
      message: "Shipping code invalid"
    }))}
  />
);

FormErrors.story = {
  name: "form errors"
};
