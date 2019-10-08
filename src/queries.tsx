import { ApolloQueryResult } from "apollo-client";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { useIntl } from "react-intl";

import AppProgress from "./components/AppProgress";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import useNavigator from "./hooks/useNavigator";
import useNotifier from "./hooks/useNotifier";
import { commonMessages } from "./intl";
import { maybe, RequireAtLeastOne } from "./misc";

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
  require?: Array<keyof TData>;
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
  return ({ children, displayLoader, skip, variables, require }) => {
    const navigate = useNavigator();
    const pushMessage = useNotifier();
    const intl = useIntl();

    return (
      <AppProgress>
        {({ setProgressState }) => (
          <Query
            fetchPolicy="cache-and-network"
            query={query}
            variables={variables}
            skip={skip}
            context={{ useBatching: true }}
            errorPolicy="all"
          >
            {(queryData: QueryResult<TData, TVariables>) => {
              if (queryData.error) {
                if (
                  !queryData.error.graphQLErrors.every(
                    err =>
                      maybe(() => err.extensions.exception.code) ===
                      "PermissionDenied"
                  )
                ) {
                  pushMessage({
                    text: intl.formatMessage(commonMessages.somethingWentWrong)
                  });
                }
              }

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

              let childrenOrNotFound = children({
                ...queryData,
                loadMore
              });
              if (
                !queryData.loading &&
                require &&
                queryData.data &&
                !require.reduce(
                  (acc, key) => acc && queryData.data[key] !== null,
                  true
                )
              ) {
                childrenOrNotFound = <ErrorPage onBack={() => navigate("/")} />;
              }

              if (displayLoader) {
                return (
                  <QueryProgress
                    loading={queryData.loading}
                    onCompleted={() => setProgressState(false)}
                    onLoading={() => setProgressState(true)}
                  >
                    {childrenOrNotFound}
                  </QueryProgress>
                );
              }

              return <>{childrenOrNotFound}</>;
            }}
          </Query>
        )}
      </AppProgress>
    );
  };
}

export const pageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;
