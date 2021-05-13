import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingMethodProducts, {
  ShippingMethodProductsProps
} from "./ShippingMethodProducts";

const products = mapEdgesToItems(
  shippingZone.shippingMethods[0].excludedProducts
);

const props: ShippingMethodProductsProps = {
  disabled: false,
  isChecked: () => undefined,
  onNextPage: () => undefined,
  onPreviousPage: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false
  },
  products,
  selected: products.length,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: () => undefined
};

storiesOf("Shipping / ShippingMethodProducts", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingMethodProducts {...props} />);
