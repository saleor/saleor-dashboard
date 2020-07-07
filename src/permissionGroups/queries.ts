import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  permissionGroupDetailsFragment,
  permissionGroupFragment
} from "@saleor/fragments/permissionGroups";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  PermissionGroupDetails,
  PermissionGroupDetailsVariables
} from "./types/PermissionGroupDetails";
import {
  PermissionGroupList,
  PermissionGroupListVariables
} from "./types/PermissionGroupList";

export const permissionGroupListQuery = gql`
  ${pageInfoFragment}
  ${permissionGroupFragment}
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
          ...PermissionGroupFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const usePermissionGroupListQuery = makeQuery<
  PermissionGroupList,
  PermissionGroupListVariables
>(permissionGroupListQuery);

export const permissionGroupDetailsQuery = gql`
  ${permissionGroupDetailsFragment}
  query PermissionGroupDetails($id: ID!, $userId: ID!) {
    permissionGroup(id: $id) {
      ...PermissionGroupDetailsFragment
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
export const usePermissionGroupDetailsQuery = makeQuery<
  PermissionGroupDetails,
  PermissionGroupDetailsVariables
>(permissionGroupDetailsQuery);
