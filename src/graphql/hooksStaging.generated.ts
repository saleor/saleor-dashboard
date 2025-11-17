import * as Types from './typesStaging.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;

export const ProductVariantsPocStaging = gql`
    query ProductVariantsPoc {
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
 * __useProductVariantsPocQuery__
 *
 * To run a query within a React component, call `useProductVariantsPocQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantsPocQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantsPocQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductVariantsPocQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductVariantsPocQuery, Types.ProductVariantsPocQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantsPocQuery, Types.ProductVariantsPocQueryVariables>(ProductVariantsPocStaging, options);
      }
export function useProductVariantsPocLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantsPocQuery, Types.ProductVariantsPocQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantsPocQuery, Types.ProductVariantsPocQueryVariables>(ProductVariantsPocStaging, options);
        }
export type ProductVariantsPocQueryHookResult = ReturnType<typeof useProductVariantsPocQuery>;
export type ProductVariantsPocLazyQueryHookResult = ReturnType<typeof useProductVariantsPocLazyQuery>;
export type ProductVariantsPocQueryResult = Apollo.QueryResult<Types.ProductVariantsPocQuery, Types.ProductVariantsPocQueryVariables>;