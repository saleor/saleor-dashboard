import { gql } from "@apollo/client";

export const staffMemberFragment = gql`
  fragment StaffMember on User {
    id
    email
    firstName
    isActive
    lastLogin
    lastName
  }
`;
export const staffMemberDetailsFragment = gql`
  fragment StaffMemberDetails on User {
    ...StaffMember
    permissionGroups {
      id
      name
      userCanManage
    }
    avatar(size: 512) {
      url
    }
    metadata {
      key
      value
    }
    privateMetadata {
      key
      value
    }
  }
`;

export const staffMemberAvatarFragment = gql`
  fragment StaffMemberAvatar on User {
    ...StaffMember
    avatar(size: 512) {
      url
    }
  }
`;
