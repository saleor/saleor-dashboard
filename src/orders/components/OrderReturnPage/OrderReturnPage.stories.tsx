import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderToReturn } from "./fixtures";
import OrderReturnPage, { OrderReturnPageProps } from "./OrderReturnPage";

const props: OrderReturnPageProps = {
  loading: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  order: orderToReturn(placeholderImage)
};

storiesOf("Views / Orders / Return order", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderReturnPage {...props} />)
  .add("loading", () => (
    <OrderReturnPage {...props} loading={true} order={undefined} />
  ));
