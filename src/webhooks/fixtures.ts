import { SearchServiceAccount_serviceAccounts_edges_node } from "@saleor/containers/SearchServiceAccount/types/SearchServiceAccount";
import { WebhookDetails_webhook } from "./types/WebhookDetails";
import { Webhooks_webhooks_edges_node } from "./types/Webhooks";

export const services: SearchServiceAccount_serviceAccounts_edges_node[] = [
  {
    __typename: "ServiceAccount",
    id: "Jzx123sEt==",
    name: "Facebook"
  },
  {
    __typename: "ServiceAccount",
    id: "Jzx123sEt==",
    name: "Twittwe"
  }
];
export const webhookList: Webhooks_webhooks_edges_node[] = [
  {
    __typename: "Webhook",
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test",
    serviceAccount: {
      __typename: "ServiceAccount",
      id: "Jzx123sEt==",
      name: "Test Account"
    }
  },
  {
    __typename: "Webhook",
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test 2",
    serviceAccount: {
      __typename: "ServiceAccount",
      id: "Jzx1ss23sEt==",
      name: "Test Account 2"
    }
  }
];
export const webhook: WebhookDetails_webhook = {
  __typename: "Webhook",
  events: [],
  id: "Jzx123sEt==",
  isActive: true,
  name: "Webhook Test 2",
  secretKey: "zxczx_asdas",
  serviceAccount: {
    __typename: "ServiceAccount",
    id: "Jzx1ss23sEt==",
    name: "Test Account 2"
  },
  targetUrl: "http://www.getsaleor.com"
};
