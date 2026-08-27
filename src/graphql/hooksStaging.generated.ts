import * as Types from './typesStaging.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;
export const MediaFragmentDoc = gql`
    fragment Media on Media {
  id
  alt
  sortOrder
  url(size: 1024)
  mediaType
  oembedData
  ... on ObjectWithMetadata {
    metadata {
      key
      value
    }
    privateMetadata {
      key
      value
    }
  }
}
    `;
export const CategoryMediaStaging = gql`
    query CategoryMedia($id: ID!) {
  category(id: $id) {
    id
    name
    media {
      ...Media
    }
  }
}
    ${MediaFragmentDoc}`;

/**
 * __useCategoryMediaQuery__
 *
 * To run a query within a React component, call `useCategoryMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryMediaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCategoryMediaQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CategoryMediaQuery, Types.CategoryMediaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CategoryMediaQuery, Types.CategoryMediaQueryVariables>(CategoryMediaStaging, options);
      }
export function useCategoryMediaLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CategoryMediaQuery, Types.CategoryMediaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CategoryMediaQuery, Types.CategoryMediaQueryVariables>(CategoryMediaStaging, options);
        }
export type CategoryMediaQueryHookResult = ReturnType<typeof useCategoryMediaQuery>;
export type CategoryMediaLazyQueryHookResult = ReturnType<typeof useCategoryMediaLazyQuery>;
export type CategoryMediaQueryResult = Apollo.QueryResult<Types.CategoryMediaQuery, Types.CategoryMediaQueryVariables>;
export const CollectionMediaStaging = gql`
    query CollectionMedia($id: ID!) {
  collection(id: $id) {
    id
    name
    media {
      ...Media
    }
  }
}
    ${MediaFragmentDoc}`;

/**
 * __useCollectionMediaQuery__
 *
 * To run a query within a React component, call `useCollectionMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionMediaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionMediaQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CollectionMediaQuery, Types.CollectionMediaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionMediaQuery, Types.CollectionMediaQueryVariables>(CollectionMediaStaging, options);
      }
export function useCollectionMediaLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionMediaQuery, Types.CollectionMediaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionMediaQuery, Types.CollectionMediaQueryVariables>(CollectionMediaStaging, options);
        }
export type CollectionMediaQueryHookResult = ReturnType<typeof useCollectionMediaQuery>;
export type CollectionMediaLazyQueryHookResult = ReturnType<typeof useCollectionMediaLazyQuery>;
export type CollectionMediaQueryResult = Apollo.QueryResult<Types.CollectionMediaQuery, Types.CollectionMediaQueryVariables>;
export const MediaCreateStaging = gql`
    mutation MediaCreate($id: ID!, $alt: String, $image: Upload, $mediaUrl: String) {
  mediaCreate(id: $id, input: {alt: $alt, image: $image, mediaUrl: $mediaUrl}) {
    media {
      ...Media
    }
    errors {
      field
      message
      code
    }
  }
}
    ${MediaFragmentDoc}`;
export type MediaCreateMutationFn = Apollo.MutationFunction<Types.MediaCreateMutation, Types.MediaCreateMutationVariables>;

/**
 * __useMediaCreateMutation__
 *
 * To run a mutation, you first call `useMediaCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMediaCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mediaCreateMutation, { data, loading, error }] = useMediaCreateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      alt: // value for 'alt'
 *      image: // value for 'image'
 *      mediaUrl: // value for 'mediaUrl'
 *   },
 * });
 */
export function useMediaCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MediaCreateMutation, Types.MediaCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MediaCreateMutation, Types.MediaCreateMutationVariables>(MediaCreateStaging, options);
      }
export type MediaCreateMutationHookResult = ReturnType<typeof useMediaCreateMutation>;
export type MediaCreateMutationResult = Apollo.MutationResult<Types.MediaCreateMutation>;
export type MediaCreateMutationOptions = Apollo.BaseMutationOptions<Types.MediaCreateMutation, Types.MediaCreateMutationVariables>;
export const MediaUpdateStaging = gql`
    mutation MediaUpdate($id: ID!, $alt: String) {
  mediaUpdate(id: $id, input: {alt: $alt}) {
    media {
      ...Media
    }
    errors {
      field
      message
      code
    }
  }
}
    ${MediaFragmentDoc}`;
export type MediaUpdateMutationFn = Apollo.MutationFunction<Types.MediaUpdateMutation, Types.MediaUpdateMutationVariables>;

/**
 * __useMediaUpdateMutation__
 *
 * To run a mutation, you first call `useMediaUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMediaUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mediaUpdateMutation, { data, loading, error }] = useMediaUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      alt: // value for 'alt'
 *   },
 * });
 */
export function useMediaUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MediaUpdateMutation, Types.MediaUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MediaUpdateMutation, Types.MediaUpdateMutationVariables>(MediaUpdateStaging, options);
      }
export type MediaUpdateMutationHookResult = ReturnType<typeof useMediaUpdateMutation>;
export type MediaUpdateMutationResult = Apollo.MutationResult<Types.MediaUpdateMutation>;
export type MediaUpdateMutationOptions = Apollo.BaseMutationOptions<Types.MediaUpdateMutation, Types.MediaUpdateMutationVariables>;
export const MediaDeleteStaging = gql`
    mutation MediaDelete($id: ID!) {
  mediaDelete(id: $id) {
    media {
      id
    }
    errors {
      field
      message
      code
    }
  }
}
    `;
export type MediaDeleteMutationFn = Apollo.MutationFunction<Types.MediaDeleteMutation, Types.MediaDeleteMutationVariables>;

/**
 * __useMediaDeleteMutation__
 *
 * To run a mutation, you first call `useMediaDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMediaDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mediaDeleteMutation, { data, loading, error }] = useMediaDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMediaDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MediaDeleteMutation, Types.MediaDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MediaDeleteMutation, Types.MediaDeleteMutationVariables>(MediaDeleteStaging, options);
      }
export type MediaDeleteMutationHookResult = ReturnType<typeof useMediaDeleteMutation>;
export type MediaDeleteMutationResult = Apollo.MutationResult<Types.MediaDeleteMutation>;
export type MediaDeleteMutationOptions = Apollo.BaseMutationOptions<Types.MediaDeleteMutation, Types.MediaDeleteMutationVariables>;
export const MediaReorderStaging = gql`
    mutation MediaReorder($id: ID!, $mediaIds: [ID!]!) {
  mediaReorder(id: $id, mediaIds: $mediaIds) {
    media {
      ...Media
    }
    errors {
      field
      message
      code
    }
  }
}
    ${MediaFragmentDoc}`;
export type MediaReorderMutationFn = Apollo.MutationFunction<Types.MediaReorderMutation, Types.MediaReorderMutationVariables>;

/**
 * __useMediaReorderMutation__
 *
 * To run a mutation, you first call `useMediaReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMediaReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mediaReorderMutation, { data, loading, error }] = useMediaReorderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      mediaIds: // value for 'mediaIds'
 *   },
 * });
 */
export function useMediaReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MediaReorderMutation, Types.MediaReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MediaReorderMutation, Types.MediaReorderMutationVariables>(MediaReorderStaging, options);
      }
export type MediaReorderMutationHookResult = ReturnType<typeof useMediaReorderMutation>;
export type MediaReorderMutationResult = Apollo.MutationResult<Types.MediaReorderMutation>;
export type MediaReorderMutationOptions = Apollo.BaseMutationOptions<Types.MediaReorderMutation, Types.MediaReorderMutationVariables>;
export const ModelMediaStaging = gql`
    query ModelMedia($id: ID!) {
  page(id: $id) {
    id
    title
    media {
      ...Media
    }
  }
}
    ${MediaFragmentDoc}`;

/**
 * __useModelMediaQuery__
 *
 * To run a query within a React component, call `useModelMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useModelMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModelMediaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useModelMediaQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ModelMediaQuery, Types.ModelMediaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ModelMediaQuery, Types.ModelMediaQueryVariables>(ModelMediaStaging, options);
      }
export function useModelMediaLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ModelMediaQuery, Types.ModelMediaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ModelMediaQuery, Types.ModelMediaQueryVariables>(ModelMediaStaging, options);
        }
export type ModelMediaQueryHookResult = ReturnType<typeof useModelMediaQuery>;
export type ModelMediaLazyQueryHookResult = ReturnType<typeof useModelMediaLazyQuery>;
export type ModelMediaQueryResult = Apollo.QueryResult<Types.ModelMediaQuery, Types.ModelMediaQueryVariables>;