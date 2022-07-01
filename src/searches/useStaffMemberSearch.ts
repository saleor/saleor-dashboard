import { gql } from "@apollo/client";
import {
  SearchStaffMembersDocument,
  SearchStaffMembersQuery,
  SearchStaffMembersQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchStaffMembers = gql`
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
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchStaffMembersQuery,
  SearchStaffMembersQueryVariables
>(SearchStaffMembersDocument);
