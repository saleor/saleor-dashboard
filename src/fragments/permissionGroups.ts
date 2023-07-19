import { gql } from "@apollo/client";

export const permissionGroupFragment = gql`
  fragment PermissionGroup on Group {
    id
    name
    userCanManage
    users {
      id
      firstName
      lastName
    }
  }
`;

export const permissionFragment = gql`
  fragment Permission on Permission {
    code
    name
  }
`;

export const permissionGroupMember = gql`
  fragment PermissionGroupMember on User {
    ...StaffMember
    avatar(size: 128) {
      url
    }
  }
`;

export const permissionGroupDetailsFragment = gql`
  fragment PermissionGroupDetails on Group {
    ...PermissionGroup
    restrictedAccessToChannels
    accessibleChannels {
      ...Channel
    }
    permissions {
      ...Permission
    }
    users {
      ...PermissionGroupMember
    }
  }
`;
