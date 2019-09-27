import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import ServiceDeleteDialog, {
  ServiceDeleteDialogProps
} from "./ServiceDeleteDialog";

const props: ServiceDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Magento Importer",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Services / Delete service", module)
  .addDecorator(Decorator)
  .add("default", () => <ServiceDeleteDialog {...props} />);
