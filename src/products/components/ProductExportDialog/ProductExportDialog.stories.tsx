import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductExportDialog, {
  ProductExportDialogProps
} from "./ProductExportDialog";

const props: ProductExportDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true
};

storiesOf("Views / Products / Export / Export settings", module)
  .addDecorator(Decorator)
  .add("interactive", () => <ProductExportDialog {...props} />);
