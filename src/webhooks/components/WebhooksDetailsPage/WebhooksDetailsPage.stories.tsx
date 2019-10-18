import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { WebhookErrorCode } from "@saleor/types/globalTypes";
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
      errors={[
        {
          code: WebhookErrorCode.INVALID,
          field: null
        }
      ].map(error => ({
        __typename: "WebhookError",
        message: "Generic form error",
        ...error
      }))}
    />
  ));
