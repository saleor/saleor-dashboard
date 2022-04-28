import { products } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
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

export default {
  title: "Shipping / ShippingMethodProductsAddDialog",
  decorators: [Decorator]
};

export const Default = () => <ShippingMethodProductsAddDialog {...props} />;

Default.story = {
  name: "default"
};
