/* eslint-disable sort-keys */
import { PermissionEnum } from "@saleor/types/globalTypes";
import { SearchStaffMembers_search_edges_node } from "@saleor/searches/types/SearchStaffMembers";
import { PermissionGroupList_permissionGroups_edges_node } from "./types/PermissionGroupList";
import { PermissionGroupDetails_permissionGroup } from "./types/PermissionGroupDetails";

export const permissionGroups: PermissionGroupList_permissionGroups_edges_node[] = [
  {
    node: {
      id: "R3JvdXA6Mg==",
      name: "Customer Support",
      users: [
        {
          id: "VXNlcjoyMQ==",
          firstName: "",
          lastName: "",
          __typename: "User" as "User"
        }
      ],
      __typename: "Group" as "Group"
    },
    __typename: "GroupCountableEdge" as "GroupCountableEdge"
  },
  {
    node: {
      id: "R3JvdXA6MQ==",
      name: "Full Access",
      users: [
        {
          id: "VXNlcjoyMQ==",
          firstName: "",
          lastName: "",
          __typename: "User" as "User"
        }
      ],
      __typename: "Group" as "Group"
    },
    __typename: "GroupCountableEdge" as "GroupCountableEdge"
  },
  {
    node: {
      id: "R3JvdXA6NA==",
      name: "Management",
      users: [],
      __typename: "Group" as "Group"
    },
    __typename: "GroupCountableEdge" as "GroupCountableEdge"
  },
  {
    node: {
      id: "R3JvdXA6Mw==",
      name: "Editors",
      users: [
        {
          id: "VXNlcjoyMw==",
          firstName: "Bryan",
          lastName: "Rodgers",
          __typename: "User" as "User"
        },
        {
          id: "VXNlcjoyMg==",
          firstName: "Joshua",
          lastName: "Mitchell",
          __typename: "User" as "User"
        }
      ],
      __typename: "Group" as "Group"
    },
    __typename: "GroupCountableEdge" as "GroupCountableEdge"
  },
  {
    node: {
      id: "R3JvdXA6NQ==",
      name: "Publishers",
      users: [],
      __typename: "Group" as "Group"
    },
    __typename: "GroupCountableEdge" as "GroupCountableEdge"
  }
].map(edge => edge.node);

export const permissionGroup: PermissionGroupDetails_permissionGroup = {
  id: "R3JvdXA6Mw==",
  name: "Editors",
  users: [
    {
      id: "VXNlcjoyMg==",
      firstName: "Joshua",
      lastName: "Mitchell",
      __typename: "User",
      email: "joshua.mitchell@example.com",
      isActive: true,
      avatar: null
    },
    {
      id: "VXNlcjoyMw==",
      firstName: "Bryan",
      lastName: "Rodgers",
      __typename: "User",
      email: "bryan.rodgers@example.com",
      isActive: true,
      avatar: null
    }
  ],
  __typename: "Group",
  permissions: [
    {
      code: PermissionEnum.MANAGE_PAGES,
      name: "Manage pages.",
      __typename: "PermissionDisplay"
    }
  ]
};

export const users: SearchStaffMembers_search_edges_node[] = [
  {
    node: {
      id: "VXNlcjoyMQ==",
      email: "admin@example.com",
      firstName: "",
      lastName: "",
      avatar: {
        alt: null,
        url: "http://placekitten.com/200/200",
        __typename: "Image" as "Image"
      },
      __typename: "User" as "User"
    },
    __typename: "UserCountableEdge" as "UserCountableEdge"
  },
  {
    node: {
      id: "VXNlcjoyMw==",
      email: "bryan.rodgers@example.com",
      firstName: "Bryan",
      lastName: "Rodgers",
      avatar: {
        alt: null,
        url: "http://placekitten.com/250/250",
        __typename: "Image" as "Image"
      },
      __typename: "User" as "User"
    },
    __typename: "UserCountableEdge" as "UserCountableEdge"
  },
  {
    node: {
      id: "VXNlcjoyMg==",
      email: "joshua.mitchell@example.com",
      firstName: "Joshua",
      lastName: "Mitchell",
      avatar: {
        alt: null,
        url: "http://placekitten.com/150/150",
        __typename: "Image" as "Image"
      },
      __typename: "User" as "User"
    },
    __typename: "UserCountableEdge" as "UserCountableEdge"
  }
].map(edge => edge.node);
