import { WebhookDetailsFragment } from "@dashboard/graphql";

export const webhook: WebhookDetailsFragment = {
  __typename: "Webhook",
  app: {
    __typename: "App",
    id: "Jzx1ss23sEt==",
    name: "Test App 2",
  },
  syncEvents: [],
  asyncEvents: [],
  id: "Jzx123sEt==",
  isActive: true,
  name: "Webhook Test 2",
  secretKey: "zxczx_asdas",
  subscriptionQuery: "subscription { event { ... on ProductUpdated { product { name } } } }",
  targetUrl: "http://www.getsaleor.com",
  customHeaders: "{}",
};
