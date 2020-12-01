import { products } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingMethodProductsAddDialog, {
  ShippingMethodProductsAddDialogProps
} from "./ShippingMethodProductsAddDialog";

const props: ShippingMethodProductsAddDialogProps = {
  confirmButtonState: "default",
  hasMore: false,
  loading: false,
  onClose: () => undefined,
  onFetch: () => undefined,
  onFetchMore: () => undefined,
  onSubmit: () => undefined,
  open: true,
  products
};

storiesOf("Shipping / ShippingMethodProductsAddDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingMethodProductsAddDialog {...props} />);
