import placeholderImage from "@assets/images/placeholder60x60.png";
import AssignProductDialog, {
  AssignProductDialogProps
} from "@saleor/components/AssignProductDialog";
import { fetchMoreProps } from "@saleor/fixtures";
import { products } from "@saleor/products/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: AssignProductDialogProps = {
  ...fetchMoreProps,
  confirmButtonState: "default",
  loading: false,
  onClose: () => undefined,
  onFetch: () => undefined,
  onSubmit: () => undefined,
  open: true,
  products: products(placeholderImage)
};

storiesOf("Generics / Assign product", module)
  .addDecorator(Decorator)
  .add("default", () => <AssignProductDialog {...props} />);
