// @ts-strict-ignore
import { WebhookErrorCode } from "@dashboard/graphql";
import React from "react";

import { webhook } from "../../fixtures";
import WebhookDetailsPage, {
  WebhookDetailsPageProps,
} from "./WebhookDetailsPage";

const props: WebhookDetailsPageProps = {
  appId: "123",
  appName: "app",
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  webhook,
  availableEvents: [],
};

export default {
  title: "Apps / Webhooks / Webhook details",
};

export const Default = () => <WebhookDetailsPage {...props} />;

export const Undefined = () => (
  <WebhookDetailsPage {...props} webhook={undefined} />
);

export const Loading = () => (
  <WebhookDetailsPage {...props} webhook={undefined} disabled={true} />
);

export const FormErrors = () => (
  <WebhookDetailsPage
    {...props}
    errors={["name", "targetUrl", "secretKey", null].map(field => ({
      __typename: "WebhookError",
      code: WebhookErrorCode.INVALID,
      field,
      message: "Webhook invalid",
    }))}
  />
);
