import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import WebhooksDetailsPage, {
  WebhooksDetailsPageProps
} from "./WebhooksDetailsPage";

const props: WebhooksDetailsPageProps = {
  disabled: false,
  errors: [],
  fetchServiceAccounts: () => undefined,
  onBack: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  services: [],
  webhook: null
};
storiesOf("Views / Webhooks / Webhook details", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhooksDetailsPage {...props} />)
  .add("loading", () => (
    <WebhooksDetailsPage
      {...props}
      webhook={undefined}
      services={undefined}
      disabled={true}
    />
  ))
  .add("form errors", () => (
    <WebhooksDetailsPage
      {...props}
      errors={["name"].map(field => formError(field))}
    />
  ));
