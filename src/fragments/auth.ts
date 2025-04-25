import { gql } from "@apollo/client";

export const userUserPermissionFragment = gql`
  fragment UserPermission on UserPermission {
    code
    name
  }
`;

export const userUserPermissionWithSourcePermissionGroupsFragment = gql`
  fragment UserUserPermissionWithSourcePermissionGroups on UserPermission {
    ...UserPermission
    sourcePermissionGroups(userId: $userId) {
      id
    }
  }
`;

export const fragmentUser = gql`
  fragment User on User {
    id
    email
    firstName
    lastName
    isStaff
    dateJoined
    metadata {
      key
      value
    }

    userPermissions {
      ...UserPermission
    }
    avatar(size: 128) {
      url
    }
    accessibleChannels {
      ...Channel
    }
    restrictedAccessToChannels
  }
`;

export const fragmentUserBase = gql`
  fragment UserBase on User {
    id
    firstName
    lastName
  }
`;

export const fragmentUserBaseAvatar = gql`
  fragment UserBaseAvatar on User {
    id
    firstName
    lastName
    email
    avatar {
      url
      alt
    }
  }
`;
