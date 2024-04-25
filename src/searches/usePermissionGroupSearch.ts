// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchPermissionGroupsDocument,
  SearchPermissionGroupsQuery,
  SearchPermissionGroupsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchPermissionGroups = gql`
  query SearchPermissionGroups($after: String, $first: Int!, $query: String!) {
    search: permissionGroups(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          userCanManage
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchPermissionGroupsQuery,
  SearchPermissionGroupsQueryVariables
>(SearchPermissionGroupsDocument);
