import { ServiceList_serviceAccounts_edges_node } from "./types/ServiceList";
import { Webhook_webhook } from "./types/Webhook";
import { Webhooks_webhooks_edges_node } from "./types/Webhooks";

export const services: ServiceList_serviceAccounts_edges_node[] = [
  {
    __typename: "ServiceAccount",
    id: "Jzx123sEt==",
    isActive: true,
    name: "Facebook"
  },
  {
    __typename: "ServiceAccount",
    id: "Jzx123sEt==",
    isActive: false,
    name: "Twittwe"
  }
];
export const webhookList: Webhooks_webhooks_edges_node[] = [
  {
    __typename: "Webhook",
    events: [],
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test",
    secretKey: "dsdasdasd_asdas",
    serviceAccount: {
      __typename: "ServiceAccount",
      id: "Jzx123sEt==",
      name: "Test Account"
    },
    targetUrl: "http://www.getsaleor.com"
  },
  {
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
  }
];
export const webhook: Webhook_webhook = {
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
