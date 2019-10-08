import { PermissionEnum } from "@saleor/types/globalTypes";
import { ServiceDetails_serviceAccount } from "./types/ServiceDetails";
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

export const service: ServiceDetails_serviceAccount = {
  __typename: "ServiceAccount" as "ServiceAccount",
  id: "1",
  isActive: true,
  name: "Magento Importer",
  permissions: [
    {
      __typename: "PermissionDisplay" as "PermissionDisplay",
      code: PermissionEnum.MANAGE_PRODUCTS,
      name: "Manage products."
    }
  ],
  tokens: [
    {
      __typename: "ServiceAccountToken",
      authToken: "AK05",
      id: "t1",
      name: "default"
    }
  ]
};
