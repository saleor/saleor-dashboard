import * as Types from './typesV323.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;

export const ProductVariantsStagingV323 = gql`
    query ProductVariantsStaging {
  productVariants(channel: "default-channel", first: 1) {
    edges {
      node {
        id
        iAmStaging: metafield(key: "test")
      }
    }
  }
}
    `;

/**
 * __useProductVariantsStagingQuery__
 *
 * To run a query within a React component, call `useProductVariantsStagingQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantsStagingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantsStagingQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductVariantsStagingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductVariantsStagingQuery, Types.ProductVariantsStagingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantsStagingQuery, Types.ProductVariantsStagingQueryVariables>(ProductVariantsStagingV323, options);
      }
export function useProductVariantsStagingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantsStagingQuery, Types.ProductVariantsStagingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantsStagingQuery, Types.ProductVariantsStagingQueryVariables>(ProductVariantsStagingV323, options);
        }
export type ProductVariantsStagingQueryHookResult = ReturnType<typeof useProductVariantsStagingQuery>;
export type ProductVariantsStagingLazyQueryHookResult = ReturnType<typeof useProductVariantsStagingLazyQuery>;
export type ProductVariantsStagingQueryResult = Apollo.QueryResult<Types.ProductVariantsStagingQuery, Types.ProductVariantsStagingQueryVariables>;