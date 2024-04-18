// @ts-strict-ignore
import { gql, useApolloClient } from "@apollo/client";
import {
  SearchProductTypesDocument,
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const searchProductTypes = gql`
  query SearchProductTypes($after: String, $first: Int!, $query: String!) {
    search: productTypes(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export function useSearchProductTypes() {
  const client = useApolloClient();

  return (query: string) =>
    client
      .query<SearchProductTypesQuery, SearchProductTypesQueryVariables>({
        query: SearchProductTypesDocument,
        variables: {
          first: 10,
          query,
        },
      })
      .then(({ data }) =>
        mapEdgesToItems(data.search).map(({ name, id }) => ({
          label: name,
          value: id,
        })),
      );
}

export default makeTopLevelSearch<SearchProductTypesQuery, SearchProductTypesQueryVariables>(
  SearchProductTypesDocument,
);
