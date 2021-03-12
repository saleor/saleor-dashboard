import { handleQueryAuthError } from "@saleor/auth";
import { RequireAtLeastOne } from "@saleor/misc";
import { ApolloQueryResult } from "apollo-client";
import { DocumentNode } from "graphql";
import { useEffect } from "react";
import { QueryResult, useQuery as useBaseQuery } from "react-apollo";
import { useIntl } from "react-intl";

import { User_userPermissions } from "../fragments/types/User";
import { PrefixedPermissions } from "../types/extendedTypes";
import { PermissionEnum } from "../types/globalTypes";
import useAppState from "./useAppState";
import useNotifier from "./useNotifier";
import useUser from "./useUser";

const getPermissionKey = (permission: string) =>
  `PERMISSION_${permission}` as PrefixedPermissions;

const allPermissions = Object.keys(PermissionEnum).reduce(
  (prev, code) => ({
    ...prev,
    [getPermissionKey(code)]: false
  }),
  {} as Record<PrefixedPermissions, boolean>
);

const getUserPermissions = (userPermissions: User_userPermissions[]) =>
  userPermissions.reduce(
    (prev, permission) => ({
      ...prev,
      [getPermissionKey(permission.code)]: true
    }),
    {} as Record<PrefixedPermissions, boolean>
  );

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
  opts: UseQueryOpts<Omit<TVariables, PrefixedPermissions>>
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
    const user = useUser();
    const userPermissions = getUserPermissions(
      user.user?.userPermissions || []
    );

    const variablesWithPermissions = {
      ...variables,
      ...allPermissions,
      ...userPermissions
    };

    const queryData = useBaseQuery(query, {
      context: {
        useBatching: true
      },
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      onError: error =>
        handleQueryAuthError(
          error,
          notify,
          user.tokenRefresh,
          user.logout,
          intl
        ),
      skip,
      variables: variablesWithPermissions
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
        variables: { ...variablesWithPermissions, ...extraVariables }
      });

    return {
      ...queryData,
      loadMore
    };
  }

  return useQuery;
}

export default makeQuery;
