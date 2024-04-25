import avatarImg from "@assets/images/avatars/avatar.png";
import { channels } from "@dashboard/fixtures";
import {
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorCode,
  PermissionGroupErrorFragment,
  PermissionGroupFragment,
  SearchStaffMembersQuery,
  StaffMemberDetailsFragment,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export const permissionGroups: PermissionGroupFragment[] = [
  {
    node: {
      id: "R3JvdXA6Mg==",
      name: "Customer Support",
      userCanManage: true,
      users: [
        {
          id: "VXNlcjoyMQ==",
          firstName: "",
          lastName: "",
          __typename: "User" as const,
        },
      ],
      __typename: "Group" as const,
    },
    __typename: "GroupCountableEdge" as const,
  },
  {
    node: {
      id: "R3JvdXA6MQ==",
      name: "Full Access",
      userCanManage: false,
      users: [
        {
          id: "VXNlcjoyMQ==",
          firstName: "",
          lastName: "",
          __typename: "User" as const,
        },
      ],
      __typename: "Group" as const,
    },
    __typename: "GroupCountableEdge" as const,
  },
  {
    node: {
      id: "R3JvdXA6NA==",
      name: "Management",
      users: [],
      userCanManage: true,
      __typename: "Group" as const,
    },
    __typename: "GroupCountableEdge" as const,
  },
  {
    node: {
      id: "R3JvdXA6Mw==",
      name: "Editors",
      userCanManage: true,
      users: [
        {
          id: "VXNlcjoyMw==",
          firstName: "Bryan",
          lastName: "Rodgers",
          __typename: "User" as const,
        },
        {
          id: "VXNlcjoyMg==",
          firstName: "Joshua",
          lastName: "Mitchell",
          __typename: "User" as const,
        },
      ],
      __typename: "Group" as const,
    },
    __typename: "GroupCountableEdge" as const,
  },
  {
    node: {
      id: "R3JvdXA6NQ==",
      name: "Publishers",
      userCanManage: true,
      users: [],
      __typename: "Group" as const,
    },
    __typename: "GroupCountableEdge" as const,
  },
].map(edge => edge.node);

export const userPermissionGroups: StaffMemberDetailsFragment["permissionGroups"] = [
  {
    id: "R3JvdXA6MQ==",
    name: "Full Access",
    userCanManage: false,
    __typename: "Group",
  },
  {
    id: "R3JvdXA6Mg==",
    name: "Customer Support",
    userCanManage: true,
    __typename: "Group",
  },
];

export const emptyPermissionGroup: PermissionGroupDetailsFragment = {
  id: "R3JvdXA6Mw==",
  name: "Editors",
  userCanManage: true,
  users: [],
  __typename: "Group",

  permissions: [
    {
      code: PermissionEnum.MANAGE_PAGES,
      name: "Manage pages.",
      __typename: "Permission",
    },
  ],
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

export const errorsOfPermissionGroupCreate: PermissionGroupErrorFragment[] = [
  {
    field: "name",
    code: PermissionGroupErrorCode.UNIQUE,
    message: "Group name has to be uniqe",
    __typename: "PermissionGroupError",
  },
  {
    field: "permissions",
    code: PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION,
    message: "Permissions out of scope",
    __typename: "PermissionGroupError",
  },
];

export const permissionGroup: PermissionGroupDetailsFragment = {
  id: "R3JvdXA6Mw==",
  name: "Editors",
  userCanManage: true,
  users: [
    {
      id: "VXNlcjoyMg==",
      firstName: "Joshua",
      lastName: "Mitchell",
      __typename: "User",
      email: "joshua.mitchell@example.com",
      isActive: true,
      avatar: null,
    },
    {
      id: "VXNlcjoyMw==",
      firstName: "Bryan",
      lastName: "Rodgers",
      __typename: "User",
      email: "bryan.rodgers@example.com",
      isActive: true,
      avatar: null,
    },
  ],
  accessibleChannels: [],
  restrictedAccessToChannels: false,
  __typename: "Group",
  permissions: [
    {
      code: PermissionEnum.MANAGE_PAGES,
      name: "Manage pages.",
      __typename: "Permission",
    },
  ],
};

export const permissionGroupWithChannels: NonNullable<PermissionGroupDetailsFragment> = {
  id: "R3JvdXA6Mw==",
  name: "Editors",
  userCanManage: true,
  users: [
    {
      id: "VXNlcjoyMg==",
      firstName: "Joshua",
      lastName: "Mitchell",
      __typename: "User",
      email: "joshua.mitchell@example.com",
      isActive: true,
      avatar: null,
    },
    {
      id: "VXNlcjoyMw==",
      firstName: "Bryan",
      lastName: "Rodgers",
      __typename: "User",
      email: "bryan.rodgers@example.com",
      isActive: true,
      avatar: null,
    },
  ],
  accessibleChannels: [channels[0]],
  restrictedAccessToChannels: true,
  __typename: "Group",
  permissions: [
    {
      code: PermissionEnum.MANAGE_PAGES,
      name: "Manage pages.",
      __typename: "Permission",
    },
  ],
};

export const users: RelayToFlat<NonNullable<SearchStaffMembersQuery["search"]>> = [
  {
    node: {
      id: "VXNlcjoyMQ==",
      email: "admin@example.com",
      firstName: "",
      lastName: "",
      isActive: true,
      avatar: {
        alt: null,
        url: avatarImg,
        __typename: "Image" as const,
      },
      __typename: "User" as const,
    },
    __typename: "UserCountableEdge" as const,
  },
  {
    node: {
      id: "VXNlcjoyMw==",
      email: "bryan.rodgers@example.com",
      firstName: "Bryan",
      lastName: "Rodgers",
      isActive: true,
      avatar: {
        alt: null,
        url: avatarImg,
        __typename: "Image" as const,
      },
      __typename: "User" as const,
    },
    __typename: "UserCountableEdge" as const,
  },
  {
    node: {
      id: "VXNlcjoyMg==",
      email: "joshua.mitchell@example.com",
      firstName: "Joshua",
      lastName: "Mitchell",
      isActive: true,
      avatar: {
        alt: null,
        url: avatarImg,
        __typename: "Image" as const,
      },
      __typename: "User" as const,
    },
    __typename: "UserCountableEdge" as const,
  },
  {
    node: {
      id: "VXNlcjoyMg==",
      email: "joshua.mitchell@example.com",
      firstName: "Joshua",
      lastName: "Mitchell",
      isActive: true,
      avatar: {
        alt: null,
        url: avatarImg,
        __typename: "Image" as const,
      },
      __typename: "User" as const,
    },
    __typename: "UserCountableEdge" as const,
  },
].map(edge => edge.node);
