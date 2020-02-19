/* eslint-disable sort-keys */
import { PermissionGroupList_permissionGroups_edges_node } from "./types/PermissionGroupList";

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
