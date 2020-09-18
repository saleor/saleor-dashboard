import avatarImage from "@assets/images/avatars/avatar1.png";
import { permissions } from "@saleor/fixtures";

import { StaffList_staffUsers_edges_node } from "./types/StaffList";
import { StaffMemberDetails_user } from "./types/StaffMemberDetails";

export const staffMembers: StaffList_staffUsers_edges_node[] = [
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Chris",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Cooper"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: false,
    lastName: "Smith"
  },
  {
    avatar: {
      __typename: "Image" as "Image",
      url: avatarImage
    },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith"
  }
].map(staffMember => ({ __typename: "User" as "User", ...staffMember }));
export const staffMember: StaffMemberDetails_user = {
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
    __typename: "UserPermission"
  }))
};
