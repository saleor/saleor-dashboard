// @ts-strict-ignore
import avatarImage from "@assets/images/avatars/avatar.png";
import { permissions } from "@dashboard/fixtures";
import {
  StaffListQuery,
  StaffMemberAvatarFragment,
  StaffMemberDetailsFragment,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

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
    lastName: "Smith",
  },
].map(staffMember => ({ __typename: "User" as const, ...staffMember }));
export const staffMember: StaffMemberDetailsFragment = {
  __typename: "User",
  avatar: { __typename: "Image" as const, url: avatarImage },
  email: "admin@example.com",
  firstName: "Jacob",
  id: "VXNlcjoyMQ==",
  isActive: true,
  lastName: "Smith",
  permissionGroups: [],
  userPermissions: permissions.map(p => ({
    ...p,
    __typename: "UserPermission",
  })),
  metadata: [],
};

export const staffMemberAvatar: StaffMemberAvatarFragment = {
  avatar: { __typename: "Image" as const, url: avatarImage },
  email: "admin@example.com",
  firstName: "Jacob",
  id: "VXNlcjoyMQ==",
  isActive: true,
  lastName: "Smith",
  __typename: "User",
};
