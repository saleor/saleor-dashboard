import {
  ApolloError,
  ApolloQueryResult,
  QueryHookOptions as BaseQueryHookOptions,
  QueryResult,
  useQuery as useBaseQuery
} from "@apollo/client";
import { handleQueryAuthError } from "@saleor/auth";
import { useUser } from "@saleor/auth";
import { RequireAtLeastOne } from "@saleor/misc";
import { ServerErrorWithName } from "@saleor/types";
import { DocumentNode } from "graphql";
import { getOperationAST } from "graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import { User_userPermissions } from "../fragments/types/User";
import { PrefixedPermissions } from "../types/extendedTypes";
import { PermissionEnum } from "../types/globalTypes";
import useAppState from "./useAppState";
import useNotifier from "./useNotifier";
export { useLazyQuery, LazyQueryHookOptions } from "@apollo/client";

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
export type QueryHookOptions<TData, TVariables> = Partial<
  BaseQueryHookOptions<TData, TVariables> & {
    displayLoader: boolean;
    handleError?: (error: ApolloError) => void | undefined;
  }
>;
type UseQueryHook<TData, TVariables> = (
  opts?: QueryHookOptions<TData, Omit<TVariables, PrefixedPermissions>>
) => UseQueryResult<TData, TVariables>;

export function useQuery<TData, TVariables>(
  query: DocumentNode,
  {
    displayLoader,
    skip,
    variables,
    fetchPolicy,
    handleError,
    ...opts
  }: QueryHookOptions<TData, TVariables> = {}
): UseQueryResult<TData, TVariables> {
  const notify = useNotifier();
  const intl = useIntl();
  const [, dispatchAppState] = useAppState();
  const user = useUser();
  const userPermissions = getUserPermissions(user.user?.userPermissions || []);

  const variablesWithPermissions = {
    ...variables,
    ...allPermissions,
    ...userPermissions
  };

  const queryData = useBaseQuery(query, {
    ...opts,
    context: {
      useBatching: true
    },
    errorPolicy: "all",
    fetchPolicy: fetchPolicy ?? "cache-and-network",
    onError: error => {
      // TO-INVESTIGATE-BATCHING
      if (
        (error.networkError as ServerErrorWithName).operationName ===
        getOperationAST(query).name.value
      ) {
        if (!!handleError) {
          handleError(error);
        } else {
          handleQueryAuthError(error, notify, user.logout, intl);
        }
      }
    },
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

function makeQuery<TData, TVariables>(
  query: DocumentNode
): UseQueryHook<TData, TVariables> {
  return (opts: QueryHookOptions<TData, TVariables>) =>
    useQuery<TData, TVariables>(query, opts);
}

export default makeQuery;
