import gql from "graphql-tag";

import { staffMemberFragment } from "./staff";

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

export const permissionGroupDetailsFragment = gql`
  ${permissionGroupFragment}
  ${permissionFragment}
  ${staffMemberFragment}
  fragment PermissionGroupDetailsFragment on Group {
    ...PermissionGroupFragment
    permissions {
      ...PermissionFragment
    }
    users {
      ...StaffMemberFragment
      avatar(size: 48) {
        url
      }
    }
  }
`;
