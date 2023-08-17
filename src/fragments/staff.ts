import { gql } from "@apollo/client";

export const staffMemberFragment = gql`
  fragment StaffMember on User {
    id
    email
    firstName
    isActive
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
    userPermissions {
      code
      name
    }
    avatar(size: 512) {
      url
    }
    metadata {
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
