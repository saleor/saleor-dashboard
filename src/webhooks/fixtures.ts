import { WebhookDetails_webhook } from "./types/WebhookDetails";
import { Webhooks_webhooks_edges_node } from "./types/Webhooks";

export const webhookList: Webhooks_webhooks_edges_node[] = [
  {
    __typename: "Webhook",
    app: {
      __typename: "App",
      id: "Jzx123sEt==",
      name: "Test App"
    },
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test"
  },
  {
    __typename: "Webhook",
    app: {
      __typename: "App",
      id: "Jzx1ss23sEt==",
      name: "Test App 2"
    },
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test 2"
  },
  {
    __typename: "Webhook",
    app: {
      __typename: "App",
      id: "Jzx1ss23sEt==",
      name: "Test App 2"
    },
    id: "Jzx12123sEt==",
    isActive: false,
    name: null
  }
];
export const webhook: WebhookDetails_webhook = {
  __typename: "Webhook",
  app: {
    __typename: "App",
    id: "Jzx1ss23sEt==",
    name: "Test App 2"
  },
  events: [],
  id: "Jzx123sEt==",
  isActive: true,
  name: "Webhook Test 2",
  secretKey: "zxczx_asdas",
  targetUrl: "http://www.getsaleor.com"
};
