import Decorator from "@saleor/storybook/Decorator";
import { WebhookErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import { webhook } from "../../fixtures";
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
  webhook
};
storiesOf("Views / Webhooks / Webhook details", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhooksDetailsPage {...props} />)
  .add("unnamed", () => (
    <WebhooksDetailsPage {...props} webhook={{ ...webhook, name: null }} />
  ))
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
      errors={["name", "targetUrl", "secretKey", null].map(field => ({
        __typename: "WebhookError",
        code: WebhookErrorCode.INVALID,
        field
      }))}
    />
  ));
