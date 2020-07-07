import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchPermissionGroups,
  SearchPermissionGroupsVariables
} from "./types/SearchPermissionGroups";

export const searchPermissionGroups = gql`
  ${pageInfoFragment}
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
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchPermissionGroups,
  SearchPermissionGroupsVariables
>(searchPermissionGroups);
