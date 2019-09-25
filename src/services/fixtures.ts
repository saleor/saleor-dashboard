import { ServiceList_serviceAccounts_edges_node } from "./types/ServiceList";

export const serviceList: ServiceList_serviceAccounts_edges_node[] = [
  {
    __typename: "ServiceAccount" as "ServiceAccount",
    id: "1",
    isActive: true,
    name: "Slack"
  },
  {
    __typename: "ServiceAccount" as "ServiceAccount",
    id: "2",
    isActive: true,
    name: "Facebook Market"
  },
  {
    __typename: "ServiceAccount" as "ServiceAccount",
    id: "3",
    isActive: false,
    name: "Magento Importer"
  }
];
