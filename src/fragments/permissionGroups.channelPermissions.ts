import { gql } from "@apollo/client";

export const newPermissionGroupDetailsFragment = gql`
  fragment NewPermissionGroupDetails on Group {
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
