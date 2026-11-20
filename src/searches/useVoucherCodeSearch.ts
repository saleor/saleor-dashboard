import { gql } from "@apollo/client";
import {
  SearchVoucherCodesDocument,
  type SearchVoucherCodesQuery,
  type SearchVoucherCodesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchVoucherCodes = gql`
  query SearchVoucherCodes($after: String, $first: Int!, $query: String!, $channel: String) {
    search: vouchers(
      after: $after
      first: $first
      channel: $channel
      filter: { search: $query, status: [ACTIVE] }
    ) {
      edges {
        node {
          id
          name
          codes(first: 20) {
            edges {
              node {
                id
                code
                isActive
                used
              }
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const useVoucherCodeSearch = makeTopLevelSearch<
  SearchVoucherCodesQuery & { search: NonNullable<SearchVoucherCodesQuery["search"]> },
  SearchVoucherCodesQueryVariables
>(SearchVoucherCodesDocument);
