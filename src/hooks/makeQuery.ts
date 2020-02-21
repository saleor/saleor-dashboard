import { ApolloQueryResult } from "apollo-client";
import { DocumentNode } from "graphql";
import { useEffect } from "react";
import { QueryResult, useQuery as useBaseQuery } from "react-apollo";
import { useIntl } from "react-intl";

import { commonMessages } from "@saleor/intl";
import { maybe, RequireAtLeastOne } from "@saleor/misc";
import useAppState from "./useAppState";
import useNotifier from "./useNotifier";

export interface LoadMore<TData, TVariables> {
  loadMore: (
    mergeFunc: (prev: TData, next: TData) => TData,
    extraVariables: Partial<TVariables>
  ) => Promise<ApolloQueryResult<TData>>;
}

export type UseQueryResult<TData, TVariables> = QueryResult<TData, TVariables> &
  LoadMore<TData, TVariables>;
type UseQueryOpts<TVariables> = Partial<{
  displayLoader: boolean;
  skip: boolean;
  variables: TVariables;
}>;
type UseQueryHook<TData, TVariables> = (
  opts: UseQueryOpts<TVariables>
) => UseQueryResult<TData, TVariables>;

function makeQuery<TData, TVariables>(
  query: DocumentNode
): UseQueryHook<TData, TVariables> {
  function useQuery({
    displayLoader,
    skip,
    variables
  }: UseQueryOpts<TVariables>): UseQueryResult<TData, TVariables> {
    const notify = useNotifier();
    const intl = useIntl();
    const [, dispatchAppState] = useAppState();
    const queryData = useBaseQuery(query, {
      context: {
        useBatching: true
      },
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      skip,
      variables
    });

    useEffect(() => {
      if (displayLoader) {
        dispatchAppState({
          payload: {
            value: queryData.loading
          },
          type: "displayLoader"
        });
      }
    }, [queryData.loading]);

    if (queryData.error) {
      if (
        !queryData.error.graphQLErrors.every(
          err =>
            maybe(() => err.extensions.exception.code) === "PermissionDenied"
        )
      ) {
        notify({
          text: intl.formatMessage(commonMessages.somethingWentWrong)
        });
      }
    }

    const loadMore = (
      mergeFunc: (previousResults: TData, fetchMoreResult: TData) => TData,
      extraVariables: RequireAtLeastOne<TVariables>
    ) =>
      queryData.fetchMore({
        query,
        updateQuery: (previousResults, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResults;
          }
          return mergeFunc(previousResults, fetchMoreResult);
        },
        variables: { ...variables, ...extraVariables }
      });

    return {
      ...queryData,
      loadMore
    };
  }

  return useQuery;
}

export default makeQuery;
