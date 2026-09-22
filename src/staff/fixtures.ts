// @ts-strict-ignore
import avatarImage from "@assets/images/avatars/avatar.png";
import {
  type StaffListQuery,
  type StaffMemberAvatarFragment,
  type StaffMemberDetailsFragment,
} from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export const staffMembers: RelayToFlat<StaffListQuery["staffUsers"]> = [
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Chris",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Cooper",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
  {
    avatar: {
      __typename: "Image" as const,
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastLogin: "2024-01-01T00:00:00+00:00",
    lastName: "Smith",
  },
].map((staffMember, index) => ({
  __typename: "User" as const,
  orders: {
    __typename: "OrderCountableConnection" as const,
    edges:
      index === 0
        ? [
            {
              __typename: "OrderCountableEdge" as const,
              node: {
                __typename: "Order" as const,
                id: "T3JkZXI6MQ==",
              },
            },
          ]
        : [],
  },
  ...staffMember,
}));
export const staffMember: StaffMemberDetailsFragment = {
  __typename: "User",
  avatar: { __typename: "Image" as const, url: avatarImage },
  email: "admin@example.com",
  firstName: "Jacob",
  id: "VXNlcjoyMQ==",
  isActive: true,
  lastLogin: "2024-01-01T00:00:00+00:00",
  lastName: "Smith",
  permissionGroups: [],
  metadata: [],
  privateMetadata: [],
};

export const staffMemberAvatar: StaffMemberAvatarFragment = {
  avatar: { __typename: "Image" as const, url: avatarImage },
  email: "admin@example.com",
  firstName: "Jacob",
  id: "VXNlcjoyMQ==",
  isActive: true,
  lastLogin: "2024-01-01T00:00:00+00:00",
  lastName: "Smith",
  __typename: "User",
};
