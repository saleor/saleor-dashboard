import { gql } from "@apollo/client";
import {
  SearchVouchersDocument,
  type SearchVouchersQuery,
  type SearchVouchersQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchVouchers = gql`
  query SearchVouchers($after: String, $first: Int!, $query: String!, $channel: String) {
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
          type
          singleUse
          discountValueType
          discountValue
          currency
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const useVoucherSearch = makeTopLevelSearch<
  SearchVouchersQuery & { search: NonNullable<SearchVouchersQuery["search"]> },
  SearchVouchersQueryVariables
>(SearchVouchersDocument);
