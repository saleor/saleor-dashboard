import { type GraphQLAppProblem, type WebhookDeliveryProblem } from "@dashboard/extensions/types";
import {
  type AppAvatarFragment,
  AppProblemDismissedByEnum,
  type AppQuery,
  AppTypeEnum,
  PermissionEnum,
} from "@dashboard/graphql";

export const appDetails: NonNullable<AppQuery["app"]> = {
  __typename: "App",
  aboutApp: "Lorem ipsum",
  accessToken: "token",
  appUrl: "http://localhost:8888/app",
  manifestUrl: "http://localhost:8888/api/manifest",
  configurationUrl: "htpp://localhost:8888/configuration",
  created: "2020-06-02T12:24:26.818138+00:00",
  dataPrivacy: "Lorem ipsum",
  dataPrivacyUrl: "http://localhost:8888/app-data-privacy",
  homepageUrl: "http://localhost:8888/homepage",
  id: "QXBwOjE4MQ==",
  isActive: true,
  metadata: [],
  name: "app1",
  author: "Saleor Commerce",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders.",
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage customers.",
    },
  ],
  privateMetadata: [],
  supportUrl: "http://localhost:8888/support",
  tokens: [],
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  webhooks: [],
  brand: null,
};

export const appAvatarFixture: AppAvatarFragment = {
  id: "QXBwOjE3Ng==",
  name: "app",
  __typename: "App",
  brand: null,
};

/*
 * App problem fixtures — shared across unit tests.
 * Use static dates so assertions are deterministic.
 */

export const criticalProblemFixture: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-1",
  key: "payment-timeout",
  message: "Payment webhook timed out",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-03T00:00:00Z",
  count: 5,
  isCritical: true,
  dismissed: null,
};

export const warningProblemFixture: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-2",
  key: "sync-delay",
  message: "Sync delayed",
  createdAt: "2024-01-02T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
  count: 1,
  isCritical: false,
  dismissed: null,
};

export const newerWarningProblemFixture: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-5",
  key: "newer-warning",
  message: "Newer warning",
  createdAt: "2024-01-04T00:00:00Z",
  updatedAt: "2024-01-04T00:00:00Z",
  count: 1,
  isCritical: false,
  dismissed: null,
};

export const dismissedProblemFixture: GraphQLAppProblem = {
  __typename: "AppProblem",
  id: "prob-3",
  key: "old-error",
  message: "Old error",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  count: 1,
  isCritical: false,
  dismissed: {
    __typename: "AppProblemDismissed",
    by: AppProblemDismissedByEnum.USER,
    userEmail: "admin@example.com",
  },
};

export const webhookErrorFixture: WebhookDeliveryProblem = {
  __typename: "WebhookDeliveryError",
  message: "Webhook delivery failed",
  createdAt: "2024-01-02T12:00:00Z",
};
