import { AppProblem, GraphQLAppProblem, WebhookDeliveryProblem } from "@dashboard/extensions/types";
import { AppProblemDismissedByEnum } from "@dashboard/graphql";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600_000).toISOString();
const dayAgo = new Date(Date.now() - 86400_000).toISOString();

export const criticalAppProblem: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-1",
  key: "payment-timeout",
  message: "Payment webhook timed out after 30s. Customers may experience failed checkouts.",
  createdAt: dayAgo,
  updatedAt: hourAgo,
  count: 12,
  isCritical: true,
  dismissed: null,
};

export const warningAppProblem: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-2",
  key: "sync-delay",
  message: "Product sync is delayed by more than 5 minutes.",
  createdAt: hourAgo,
  updatedAt: hourAgo,
  count: 1,
  isCritical: false,
  dismissed: null,
};

export const dismissedByUserProblem: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-3",
  key: "old-error",
  message: "Inventory sync failed for warehouse EU-1.",
  createdAt: dayAgo,
  updatedAt: dayAgo,
  count: 3,
  isCritical: false,
  dismissed: {
    __typename: "AppProblemDismissed",
    by: AppProblemDismissedByEnum.USER,
    userEmail: "admin@example.com",
  },
};

export const dismissedByAppProblem: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-4",
  key: "auto-resolved",
  message: "Temporary rate limit exceeded. Resolved automatically.",
  createdAt: dayAgo,
  updatedAt: dayAgo,
  count: 1,
  isCritical: false,
  dismissed: {
    __typename: "AppProblemDismissed",
    by: AppProblemDismissedByEnum.APP,
    userEmail: null,
  },
};

export const extraWarningProblem: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-extra-1",
  key: "extra-warning-1",
  message: "Shipping rate calculation returned fallback value.",
  createdAt: hourAgo,
  updatedAt: hourAgo,
  count: 1,
  isCritical: false,
  dismissed: null,
};

export const webhookDeliveryError: WebhookDeliveryProblem = {
  __typename: "WebhookDeliveryError",
  message: "Webhook delivery failed: 502 Bad Gateway from https://app.example.com/webhooks",
  createdAt: now,
};

/** Collection of all fixture problems for use in tests and stories */
export const allFixtureProblems: AppProblem[] = [
  criticalAppProblem,
  warningAppProblem,
  dismissedByUserProblem,
  dismissedByAppProblem,
  extraWarningProblem,
  webhookDeliveryError,
];
