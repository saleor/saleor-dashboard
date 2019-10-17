import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import WebhookDeleteDialog, {
  WebhookDeleteDialogProps
} from "./WebhookDeleteDialog";

const props: WebhookDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Magento Importer",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Webhooks / Delete webhook", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhookDeleteDialog {...props} />);
