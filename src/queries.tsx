import { ApolloQueryResult } from "apollo-client";
import { DocumentNode } from "graphql";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { useIntl } from "react-intl";

import { handleQueryAuthError } from "./auth";
import useAppState from "./hooks/useAppState";
import useNotifier from "./hooks/useNotifier";
import useUser from "./hooks/useUser";
import { RequireAtLeastOne } from "./misc";

export interface LoadMore<TData, TVariables> {
  loadMore: (
    mergeFunc: (prev: TData, next: TData) => TData,
    extraVariables: Partial<TVariables>
  ) => Promise<ApolloQueryResult<TData>>;
}

export type TypedQueryResult<TData, TVariables> = QueryResult<
  TData,
  TVariables
> &
  LoadMore<TData, TVariables>;

export interface TypedQueryInnerProps<TData, TVariables> {
  children: (result: TypedQueryResult<TData, TVariables>) => React.ReactNode;
  displayLoader?: boolean;
  skip?: boolean;
  variables?: TVariables;
}

interface QueryProgressProps {
  loading: boolean;
  onLoading: () => void;
  onCompleted: () => void;
}

class QueryProgress extends React.Component<QueryProgressProps, {}> {
  componentDidMount() {
    const { loading, onLoading } = this.props;
    if (loading) {
      onLoading();
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, onLoading, onCompleted } = this.props;
    if (prevProps.loading !== loading) {
      if (loading) {
        onLoading();
      } else {
        onCompleted();
      }
    }
  }

  render() {
    return this.props.children;
  }
}

// For some reason Query returns () => Element instead of () => ReactNode
export function TypedQuery<TData, TVariables>(
  query: DocumentNode
): React.FC<TypedQueryInnerProps<TData, TVariables>> {
  return ({ children, displayLoader, skip, variables }) => {
    const notify = useNotifier();
    const [, dispatchAppState] = useAppState();
    const intl = useIntl();
    const user = useUser();

    return (
      <Query
        fetchPolicy="cache-and-network"
        query={query}
        variables={variables}
        skip={skip}
        context={{ useBatching: true }}
        errorPolicy="all"
        onError={error =>
          handleQueryAuthError(
            error,
            notify,
            user.tokenRefresh,
            user.logout,
            intl
          )
        }
      >
        {(queryData: QueryResult<TData, TVariables>) => {
          const loadMore = (
            mergeFunc: (
              previousResults: TData,
              fetchMoreResult: TData
            ) => TData,
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

          if (displayLoader) {
            return (
              <QueryProgress
                loading={queryData.loading}
                onCompleted={() =>
                  dispatchAppState({
                    payload: {
                      value: false
                    },
                    type: "displayLoader"
                  })
                }
                onLoading={() =>
                  dispatchAppState({
                    payload: {
                      value: true
                    },
                    type: "displayLoader"
                  })
                }
              >
                {children({
                  ...queryData,
                  loadMore
                })}
              </QueryProgress>
            );
          }

          return (
            <>
              {children({
                ...queryData,
                loadMore
              })}
            </>
          );
        }}
      </Query>
    );
  };
}
