import { storiesOf } from "@storybook/react";
import React from "react";

import AssignProductDialog, {
  AssignProductDialogProps
} from "@saleor/components/AssignProductDialog";
import { products } from "@saleor/products/fixtures";
import Decorator from "../../Decorator";
import placeholderImage from "../@assets/images/placeholder60x60.png";

const props: AssignProductDialogProps = {
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
