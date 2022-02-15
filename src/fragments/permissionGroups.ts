import { gql } from "@apollo/client";

export const permissionGroupFragment = gql`
  fragment PermissionGroupFragment on Group {
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
  fragment PermissionFragment on Permission {
    code
    name
  }
`;

export const permissionGroupMember = gql`
  fragment PermissionGroupMember on User {
    ...StaffMemberFragment
    avatar(size: 48) {
      url
    }
  }
`;

export const permissionGroupDetailsFragment = gql`
  fragment PermissionGroupDetailsFragment on Group {
    ...PermissionGroupFragment
    permissions {
      ...PermissionFragment
    }
    users {
      ...PermissionGroupMember
    }
  }
`;
