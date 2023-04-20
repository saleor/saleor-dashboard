import { gql } from "@apollo/client";

export const PermissionGroupWithContextDetailsFragment = gql`
  fragment PermissionGroupWithContextDetails on Group {
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
