import * as Types from './typesStaging.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;
export const AnnouncementFragmentDoc = gql`
    fragment Announcement on Announcement {
  title
  messageHtml
  importance
  type
  createdAt
  updatedAt
  extra
}
    `;
export const AnnouncementsStaging = gql`
    query Announcements {
  shop {
    announcements {
      ...Announcement
    }
  }
}
    ${AnnouncementFragmentDoc}`;

/**
 * __useAnnouncementsQuery__
 *
 * To run a query within a React component, call `useAnnouncementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnouncementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnouncementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAnnouncementsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.AnnouncementsQuery, Types.AnnouncementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AnnouncementsQuery, Types.AnnouncementsQueryVariables>(AnnouncementsStaging, options);
      }
export function useAnnouncementsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AnnouncementsQuery, Types.AnnouncementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AnnouncementsQuery, Types.AnnouncementsQueryVariables>(AnnouncementsStaging, options);
        }
export type AnnouncementsQueryHookResult = ReturnType<typeof useAnnouncementsQuery>;
export type AnnouncementsLazyQueryHookResult = ReturnType<typeof useAnnouncementsLazyQuery>;
export type AnnouncementsQueryResult = Apollo.QueryResult<Types.AnnouncementsQuery, Types.AnnouncementsQueryVariables>;