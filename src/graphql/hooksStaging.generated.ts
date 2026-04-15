import * as Types from './typesStaging.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;
export const ChannelErrorFragmentDoc = gql`
    fragment ChannelError on ChannelError {
  code
  field
  message
}
    `;
export const ChannelFragmentDoc = gql`
    fragment Channel on Channel {
  id
  isActive
  name
  slug
  currencyCode
  defaultCountry {
    code
    country
  }
  stockSettings {
    allocationStrategy
  }
}
    `;
export const WarehouseFragmentDoc = gql`
    fragment Warehouse on Warehouse {
  id
  name
}
    `;
export const ChannelDetailsFragmentDoc = gql`
    fragment ChannelDetails on Channel {
  ...Channel
  hasOrders
  warehouses {
    ...Warehouse
  }
  orderSettings {
    markAsPaidStrategy
    deleteExpiredOrdersAfter
    allowUnpaidOrders
  }
  paymentSettings {
    defaultTransactionFlowStrategy
  }
  checkoutSettings {
    automaticallyCompleteFullyPaidCheckouts
    allowLegacyGiftCardUse
  }
}
    ${ChannelFragmentDoc}
${WarehouseFragmentDoc}`;
export const WarehouseWithShippingFragmentDoc = gql`
    fragment WarehouseWithShipping on Warehouse {
  ...Warehouse
  shippingZones(first: 100) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    ${WarehouseFragmentDoc}`;
export const AddressFragmentDoc = gql`
    fragment Address on Address {
  city
  cityArea
  companyName
  country {
    __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
}
    `;
export const WarehouseDetailsFragmentDoc = gql`
    fragment WarehouseDetails on Warehouse {
  isPrivate
  clickAndCollectOption
  ...WarehouseWithShipping
  address {
    ...Address
  }
  email
}
    ${WarehouseWithShippingFragmentDoc}
${AddressFragmentDoc}`;
export const ChannelCreateStaging = gql`
    mutation ChannelCreate($input: ChannelCreateInput!) {
  channelCreate(input: $input) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelCreateMutationFn = Apollo.MutationFunction<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>;

/**
 * __useChannelCreateMutation__
 *
 * To run a mutation, you first call `useChannelCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelCreateMutation, { data, loading, error }] = useChannelCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChannelCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>(ChannelCreateStaging, options);
      }
export type ChannelCreateMutationHookResult = ReturnType<typeof useChannelCreateMutation>;
export type ChannelCreateMutationResult = Apollo.MutationResult<Types.ChannelCreateMutation>;
export type ChannelCreateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>;
export const ChannelUpdateStaging = gql`
    mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
  channelUpdate(id: $id, input: $input) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelUpdateMutationFn = Apollo.MutationFunction<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>;

/**
 * __useChannelUpdateMutation__
 *
 * To run a mutation, you first call `useChannelUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelUpdateMutation, { data, loading, error }] = useChannelUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChannelUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>(ChannelUpdateStaging, options);
      }
export type ChannelUpdateMutationHookResult = ReturnType<typeof useChannelUpdateMutation>;
export type ChannelUpdateMutationResult = Apollo.MutationResult<Types.ChannelUpdateMutation>;
export type ChannelUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>;
export const BaseChannelsStaging = gql`
    query BaseChannels {
  channels {
    ...Channel
  }
}
    ${ChannelFragmentDoc}`;

/**
 * __useBaseChannelsQuery__
 *
 * To run a query within a React component, call `useBaseChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBaseChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBaseChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useBaseChannelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>(BaseChannelsStaging, options);
      }
export function useBaseChannelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>(BaseChannelsStaging, options);
        }
export type BaseChannelsQueryHookResult = ReturnType<typeof useBaseChannelsQuery>;
export type BaseChannelsLazyQueryHookResult = ReturnType<typeof useBaseChannelsLazyQuery>;
export type BaseChannelsQueryResult = Apollo.QueryResult<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>;
export const ChannelsStaging = gql`
    query Channels {
  channels {
    ...ChannelDetails
  }
}
    ${ChannelDetailsFragmentDoc}`;

/**
 * __useChannelsQuery__
 *
 * To run a query within a React component, call `useChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useChannelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ChannelsQuery, Types.ChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelsQuery, Types.ChannelsQueryVariables>(ChannelsStaging, options);
      }
export function useChannelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelsQuery, Types.ChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelsQuery, Types.ChannelsQueryVariables>(ChannelsStaging, options);
        }
export type ChannelsQueryHookResult = ReturnType<typeof useChannelsQuery>;
export type ChannelsLazyQueryHookResult = ReturnType<typeof useChannelsLazyQuery>;
export type ChannelsQueryResult = Apollo.QueryResult<Types.ChannelsQuery, Types.ChannelsQueryVariables>;
export const ChannelStaging = gql`
    query Channel($id: ID!) {
  channel(id: $id) {
    ...ChannelDetails
  }
}
    ${ChannelDetailsFragmentDoc}`;

/**
 * __useChannelQuery__
 *
 * To run a query within a React component, call `useChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ChannelQuery, Types.ChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelQuery, Types.ChannelQueryVariables>(ChannelStaging, options);
      }
export function useChannelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelQuery, Types.ChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelQuery, Types.ChannelQueryVariables>(ChannelStaging, options);
        }
export type ChannelQueryHookResult = ReturnType<typeof useChannelQuery>;
export type ChannelLazyQueryHookResult = ReturnType<typeof useChannelLazyQuery>;
export type ChannelQueryResult = Apollo.QueryResult<Types.ChannelQuery, Types.ChannelQueryVariables>;