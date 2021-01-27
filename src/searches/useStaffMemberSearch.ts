import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchStaffMembers,
  SearchStaffMembersVariables
} from "./types/SearchStaffMembers";

export const searchStaffMembers = gql`
  ${pageInfoFragment}
  query SearchStaffMembers($after: String, $first: Int!, $query: String!) {
    search: staffUsers(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
      edges {
        node {
          id
          email
          firstName
          lastName
          isActive
          avatar {
            alt
            url
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchStaffMembers,
  SearchStaffMembersVariables
>(searchStaffMembers);
