import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { orderToRefund } from "./fixtures";
import { OrderRefundType } from "./form";
import OrderRefundPage, { OrderRefundPageProps } from "./OrderRefundPage";

const props: OrderRefundPageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  order: orderToRefund(placeholderImage)
};

export default {
  title: "Views / Orders / Refund order",
  decorators: [Decorator]
};

export const Products = () => (
  <OrderRefundPage {...props} defaultType={OrderRefundType.PRODUCTS} />
);

Products.story = {
  name: "products"
};

export const Miscellaneous = () => (
  <OrderRefundPage {...props} defaultType={OrderRefundType.MISCELLANEOUS} />
);

Miscellaneous.story = {
  name: "miscellaneous"
};

export const Loading = () => (
  <OrderRefundPage {...props} disabled={true} order={undefined} />
);

Loading.story = {
  name: "loading"
};
