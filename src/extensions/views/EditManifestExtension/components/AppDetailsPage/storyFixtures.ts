import { appDetails } from "@dashboard/extensions/fixtures";
import { type AppQuery, PermissionEnum, WebhookEventTypeAsyncEnum } from "@dashboard/graphql";

export const installedAppStory: NonNullable<AppQuery["app"]> = {
  ...appDetails,
  name: "Klaviyo",
  aboutApp: "Sync customers and orders to Klaviyo for email flows.",
  appUrl: "https://klaviyo.saleor.app/app",
  manifestUrl: "https://klaviyo.saleor.app/api/manifest",
  version: "1.4.2",
  extensions: [
    {
      __typename: "AppExtension",
      id: "ext-1",
      label: "Order widget",
      url: "https://klaviyo.saleor.app/widgets/order",
      mountName: "ORDER_DETAILS_WIDGETS",
      targetName: "WIDGET",
      permissions: [],
    },
  ],
  webhooks: [
    {
      __typename: "Webhook",
      id: "webhook-1",
      name: "Order created",
      isActive: true,
      targetUrl: "https://klaviyo.saleor.app/api/webhooks/order-created",
      subscriptionQuery: JSON.stringify(
        'subscription { event { ... on OrderCreated { order { id metafield(key: "crm") } } } }',
      ),
      syncEvents: [],
      asyncEvents: [
        { __typename: "WebhookEventAsync", eventType: WebhookEventTypeAsyncEnum.ORDER_CREATED },
      ],
      app: { __typename: "App", id: appDetails.id, name: "Klaviyo" },
    },
  ],
  permissions: [
    { __typename: "Permission", code: PermissionEnum.MANAGE_ORDERS, name: "Manage orders" },
    { __typename: "Permission", code: PermissionEnum.MANAGE_PRODUCTS, name: "Manage products" },
  ],
};
