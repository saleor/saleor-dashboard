import { WebhookErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { webhook } from "../../fixtures";
import WebhookDetailsPage, {
  WebhookDetailsPageProps
} from "./WebhookDetailsPage";

const props: WebhookDetailsPageProps = {
  appName: "app",
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  webhook
};

export default {
  title: "Views / Apps / Webhooks / Webhook details",
  decorators: [Decorator]
};

export const Default = () => <WebhookDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Undefined = () => (
  <WebhookDetailsPage {...props} webhook={undefined} />
);

Undefined.story = {
  name: "undefined"
};

export const Unnamed = () => (
  <WebhookDetailsPage {...props} webhook={{ ...webhook, name: null }} />
);

Unnamed.story = {
  name: "unnamed"
};

export const Loading = () => (
  <WebhookDetailsPage {...props} webhook={undefined} disabled={true} />
);

Loading.story = {
  name: "loading"
};

export const FormErrors = () => (
  <WebhookDetailsPage
    {...props}
    errors={["name", "targetUrl", "secretKey", null].map(field => ({
      __typename: "WebhookError",
      code: WebhookErrorCode.INVALID,
      field,
      message: "Webhook invalid"
    }))}
  />
);

FormErrors.story = {
  name: "form errors"
};
