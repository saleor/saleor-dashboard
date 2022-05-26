import { gql } from "@apollo/client";
import {
  SearchPermissionGroupsDocument,
  SearchPermissionGroupsQuery,
  SearchPermissionGroupsQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchPermissionGroups = gql`
  query SearchPermissionGroups($after: String, $first: Int!, $query: String!) {
    search: permissionGroups(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
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
