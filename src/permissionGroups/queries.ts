import { gql } from "@apollo/client";

export const permissionGroupListQuery = gql`
  query PermissionGroupList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: PermissionGroupFilterInput
    $sort: PermissionGroupSortingInput
  ) {
    permissionGroups(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...PermissionGroup
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const permissionGroupDetailsQuery = gql`
  query PermissionGroupDetails($id: ID!, $userId: ID!) {
    permissionGroup(id: $id) {
      ...PermissionGroupDetails
    }
    user(id: $userId) {
      editableGroups {
        id
      }
      userPermissions {
        code
        sourcePermissionGroups(userId: $userId) {
          id
        }
      }
    }
  }
`;
