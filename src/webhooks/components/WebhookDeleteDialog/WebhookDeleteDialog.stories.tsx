import Decorator from "@saleor/storybook/Decorator";
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

export default {
  title: "Views / Apps / Webhooks / Delete webhook",
  decorators: [Decorator]
};

export const Default = () => <WebhookDeleteDialog {...props} />;

Default.story = {
  name: "default"
};

export const UnnamedWebhook = () => (
  <WebhookDeleteDialog {...props} name={null} />
);

UnnamedWebhook.story = {
  name: "unnamed webhook"
};
