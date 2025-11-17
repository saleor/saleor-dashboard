import * as Types from './typesStaging.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;

export const ProductVariantsStaging = gql`
    query ProductVariants {
  productVariants(channel: "default-channel", first: 1) {
    edges {
      node {
        id
        breakingField
      }
    }
  }
}
    `;

/**
 * __useProductVariantsQuery__
 *
 * To run a query within a React component, call `useProductVariantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductVariantsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductVariantsQuery, Types.ProductVariantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantsQuery, Types.ProductVariantsQueryVariables>(ProductVariantsStaging, options);
      }
export function useProductVariantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantsQuery, Types.ProductVariantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantsQuery, Types.ProductVariantsQueryVariables>(ProductVariantsStaging, options);
        }
export type ProductVariantsQueryHookResult = ReturnType<typeof useProductVariantsQuery>;
export type ProductVariantsLazyQueryHookResult = ReturnType<typeof useProductVariantsLazyQuery>;
export type ProductVariantsQueryResult = Apollo.QueryResult<Types.ProductVariantsQuery, Types.ProductVariantsQueryVariables>;