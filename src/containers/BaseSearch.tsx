import { DocumentNode } from "graphql";
import React from "react";

import Debounce from "../components/Debounce";
import { TypedQuery, TypedQueryResult } from "../queries";

export interface SearchQueryVariables {
  after?: string;
  first: number;
  query: string;
}

interface BaseSearchProps<
  TQuery,
  TQueryVariables extends SearchQueryVariables
> {
  children: (props: {
    loadMore: () => void;
    search: (query: string) => void;
    result: TypedQueryResult<TQuery, TQueryVariables>;
  }) => React.ReactElement<any>;
  variables: TQueryVariables;
}

function BaseSearch<TQuery, TQueryVariables extends SearchQueryVariables>(
  query: DocumentNode,
  loadMoreFn: (result: TypedQueryResult<TQuery, TQueryVariables>) => void
) {
  const Query = TypedQuery<TQuery, TQueryVariables>(query);

  class BaseSearchComponent extends React.Component<
    BaseSearchProps<TQuery, TQueryVariables>,
    SearchQueryVariables
  > {
    state: SearchQueryVariables = {
      first: this.props.variables.first,
      query: this.props.variables.query
    };

    search = (query: string) => {
      if (query === undefined) {
        this.setState({ query: "" });
      } else {
        this.setState({ query });
      }
    };

    render() {
      const { children, variables } = this.props;

      return (
        <Debounce debounceFn={this.search} time={200}>
          {search => (
            <Query
              displayLoader={true}
              variables={{
                ...variables,
                query: this.state.query
              }}
            >
              {result =>
                children({
                  loadMore: () => loadMoreFn(result),
                  result,
                  search
                })
              }
            </Query>
          )}
        </Debounce>
      );
    }
  }
  return BaseSearchComponent;
}

export default BaseSearch;
