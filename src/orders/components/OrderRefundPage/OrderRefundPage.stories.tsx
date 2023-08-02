// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder60x60.png";
import React from "react";

import { orderToRefund } from "./fixtures";
import { OrderRefundType } from "./form";
import OrderRefundPage, { OrderRefundPageProps } from "./OrderRefundPage";

const props: OrderRefundPageProps = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  order: orderToRefund(placeholderImage),
};

export default {
  title: "Orders / Refund order",
};

export const Products = () => (
  <OrderRefundPage {...props} defaultType={OrderRefundType.PRODUCTS} />
);

export const Miscellaneous = () => (
  <OrderRefundPage {...props} defaultType={OrderRefundType.MISCELLANEOUS} />
);

export const Loading = () => (
  <OrderRefundPage {...props} disabled={true} order={undefined} />
);
