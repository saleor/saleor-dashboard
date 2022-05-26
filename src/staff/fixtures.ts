import avatarImage from "@assets/images/avatars/avatar1.png";
import { permissions } from "@saleor/fixtures";
import { StaffListQuery, StaffMemberDetailsFragment } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

export const staffMembers: RelayToFlat<StaffListQuery["staffUsers"]> = [
  {
    avatar: {
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
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
      __typename: "Image" as "Image",
      url: avatarImage,
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith",
  },
].map(staffMember => ({ __typename: "User" as "User", ...staffMember }));
export const staffMember: StaffMemberDetailsFragment = {
  __typename: "User",
  avatar: { __typename: "Image" as "Image", url: avatarImage },
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
};
