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
    avatar(size: 120) {
      url
    }
  }
`;

export const staffMemberAvatarFragment = gql`
  fragment StaffMemberAvatar on User {
    ...StaffMember
    avatar(size: 120) {
      url
    }
  }
`;
