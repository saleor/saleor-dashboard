// @ts-strict-ignore
import { gql, useApolloClient } from "@apollo/client";
import {
  SearchAttributeValuesDocument,
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables,
} from "@dashboard/graphql";
import makeSearch from "@dashboard/hooks/makeSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const searchAttributeValues = gql`
  query SearchAttributeValues($id: ID, $after: String, $first: Int!, $query: String!) {
    attribute(id: $id) {
      id
      choices(after: $after, first: $first, filter: { search: $query }) {
        edges {
          node {
            ...AttributeValueDetails
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export function useSearchAttributeValuesSuggestions() {
  const client = useApolloClient();

  return (id: string, query: string) =>
    client
      .query<SearchAttributeValuesQuery, SearchAttributeValuesQueryVariables>({
        query: SearchAttributeValuesDocument,
        variables: {
          id,
          first: 10,
          query,
        },
      })
      .then(({ data }) =>
        mapEdgesToItems(data.attribute.choices).map(({ name, slug }) => ({
          label: name,
          value: slug,
        })),
      );
}

export default makeSearch<SearchAttributeValuesQuery, SearchAttributeValuesQueryVariables>(
  SearchAttributeValuesDocument,
  result => {
    if (result.data?.attribute.choices.pageInfo.hasNextPage) {
      result.loadMore(
        (prev, next) => {
          if (
            prev.attribute.choices.pageInfo.endCursor === next.attribute.choices.pageInfo.endCursor
          ) {
            return prev;
          }

          return {
            ...prev,
            attribute: {
              ...prev.attribute,
              choices: {
                ...prev.attribute.choices,
                edges: [...prev.attribute.choices.edges, ...next.attribute.choices.edges],
                pageInfo: next.attribute.choices.pageInfo,
              },
            },
          };
        },
        {
          ...result.variables,
          after: result.data.attribute.choices.pageInfo.endCursor,
        },
      );
    }
  },
);
