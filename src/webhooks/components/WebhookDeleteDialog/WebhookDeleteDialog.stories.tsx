import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Views / Apps / Webhooks / Delete webhook", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhookDeleteDialog {...props} />)
  .add("unnamed webhook", () => <WebhookDeleteDialog {...props} name={null} />);
