import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingMethodProducts, {
  ShippingMethodProductsProps,
} from "./ShippingMethodProducts";

const products = mapEdgesToItems(
  shippingZone.shippingMethods[0].excludedProducts,
);

const props: ShippingMethodProductsProps = {
  disabled: false,
  isChecked: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  products,
  selected: products.length,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: () => undefined,
};

storiesOf("Shipping / ShippingMethodProducts", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <ShippingMethodProducts {...props} />);
