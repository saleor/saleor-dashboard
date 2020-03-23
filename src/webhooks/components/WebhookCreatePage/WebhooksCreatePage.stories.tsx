import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { WebhookErrorCode } from "@saleor/types/globalTypes";
import WebhookCreatePage, { WebhookCreatePageProps } from "./WebhookCreatePage";

const props: WebhookCreatePageProps = {
  disabled: false,
  errors: [],
  fetchServiceAccounts: () => undefined,
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  services: []
};
storiesOf("Views / Webhooks / Create webhook", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhookCreatePage {...props} />)
  .add("loading", () => <WebhookCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <WebhookCreatePage
      {...props}
      errors={["name", "targetUrl", "secretKey", null].map(field => ({
        __typename: "WebhookError",
        code: WebhookErrorCode.INVALID,
        field
      }))}
    />
  ));
