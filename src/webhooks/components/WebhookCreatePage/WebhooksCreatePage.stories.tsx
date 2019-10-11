import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import WebhookCreatePage, { WebhookCreatePageProps } from "./WebhookCreatePage";

const props: WebhookCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  services: []
};
storiesOf("Views / Webhook / Create webhook", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhookCreatePage {...props} />)
  .add("loading", () => <WebhookCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <WebhookCreatePage
      {...props}
      errors={["name"].map(field => formError(field))}
    />
  ));
