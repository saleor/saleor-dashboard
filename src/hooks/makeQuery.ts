// @ts-strict-ignore
import {
  type ApolloError,
  type ApolloQueryResult,
  type LazyQueryHookOptions as BaseLazyQueryHookOptions,
  type OperationVariables,
  type QueryHookOptions as BaseQueryHookOptions,
  type QueryResult,
  useQuery as useBaseQuery,
} from "@apollo/client";
import { isSessionEndedError, isSessionExpiredError } from "@dashboard/auth/errors";
import { useUser } from "@dashboard/auth/useUser";
import { handleQueryAuthError } from "@dashboard/auth/utils";
import { connectionMonitor } from "@dashboard/connection/appConnectionMonitor";
import { isConnectionError } from "@dashboard/connection/connectionErrors";
import { connectionMessages } from "@dashboard/connection/messages";
import { type PrefixedPermissions } from "@dashboard/graphql/extendedTypes";
import { PermissionEnum, type UserPermissionFragment } from "@dashboard/graphql/types.generated";
import { commonMessages } from "@dashboard/intl";
import { type RequireAtLeastOne } from "@dashboard/misc";
import { type DocumentNode } from "graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import useAppState from "./useAppState";
import { useNotifier } from "./useNotifier/useNotifier";

export { useLazyQuery } from "@apollo/client";

const getPermissionKey = (permission: string) => `PERMISSION_${permission}` as PrefixedPermissions;

export const allPermissions: Record<PrefixedPermissions, boolean> = Object.keys(
  PermissionEnum,
).reduce(
  (prev, code) => ({
    ...prev,
    [getPermissionKey(code)]: false,
  }),
  {} as Record<PrefixedPermissions, boolean>,
);

const getUserPermissions = (
  userPermissions: UserPermissionFragment[],
): Record<PrefixedPermissions, boolean> =>
  userPermissions.reduce(
    (prev, permission) => ({
      ...prev,
      [getPermissionKey(permission.code)]: true,
    }),
    {} as Record<PrefixedPermissions, boolean>,
  );

interface LoadMore<TData, TVariables> {
  loadMore: (
    mergeFunc: (prev: TData, next: TData) => TData,
    extraVariables: Partial<TVariables>,
  ) => Promise<ApolloQueryResult<TData>>;
}

export type LazyQueryHookOptions<
  TData = any,
  TVariables = OperationVariables,
> = BaseLazyQueryHookOptions<TData, TVariables>;

export type UseQueryResult<TData, TVariables> = QueryResult<TData, TVariables> &
  LoadMore<TData, TVariables>;
export type QueryHookOptions<TData, TVariables> = Partial<
  Omit<BaseQueryHookOptions<TData, TVariables>, "variables"> & {
    displayLoader: boolean;
    handleError?: (error: ApolloError) => void | undefined;
    variables?: Omit<TVariables, PrefixedPermissions>;
  }
>;

type UseQueryHook<TData, TVariables> = (
  opts?: QueryHookOptions<TData, Omit<TVariables, PrefixedPermissions>>,
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
  }: QueryHookOptions<TData, TVariables> = {},
): UseQueryResult<TData, TVariables> {
  const notify = useNotifier();
  const intl = useIntl();
  const [, dispatchAppState] = useAppState();
  const user = useUser();
  const userPermissions = getUserPermissions(user.user?.userPermissions || []);
  const variablesWithPermissions = {
    ...variables,
    ...allPermissions,
    ...userPermissions,
  } as TVariables & Record<PrefixedPermissions, boolean>;
  const queryData = useBaseQuery(query, {
    ...opts,
    context: {
      useBatching: true,
    },
    errorPolicy: "all",
    fetchPolicy: fetchPolicy ?? "cache-and-network",
    onError: error => {
      // Dropped because its session ended: nothing went wrong for the merchant.
      if (isSessionEndedError(error)) {
        return;
      }

      // The API refused the session's refresh token while this load waited, which logged out.
      if (isSessionExpiredError(error)) {
        notify({ status: "error", text: intl.formatMessage(commonMessages.sessionExpired) });

        return;
      }

      if (handleError) {
        handleError(error);
      } else if (!isConnectionError(error)) {
        handleQueryAuthError(error, notify, user.logout, intl);
      } else if (!connectionMonitor.isBannerAttached()) {
        // No connection banner on this screen (sign-in, startup) to explain the failure and
        // reload the data, so say it here, without the network text.
        notify({
          status: "error",
          title: intl.formatMessage(connectionMessages.loadFailedTitle),
          text: intl.formatMessage(connectionMessages.loadFailedDescription),
        });
      }
      // Otherwise the banner covers the outage, and the query reloads once Saleor answers.
    },
    skip,
    variables: variablesWithPermissions,
  });

  useEffect(() => {
    if (displayLoader) {
      dispatchAppState({
        payload: {
          value: queryData.loading,
        },
        type: "displayLoader",
      });
    }
  }, [queryData.loading]);

  const loadMore = (
    mergeFunc: (previousResults: TData, fetchMoreResult: TData) => TData,
    extraVariables: RequireAtLeastOne<TVariables>,
  ) =>
    queryData.fetchMore({
      query,
      updateQuery: (previousResults, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResults;
        }

        return mergeFunc(previousResults, fetchMoreResult);
      },
      variables: { ...variablesWithPermissions, ...extraVariables },
    });

  return {
    ...queryData,
    loadMore,
  };
}

function makeQuery<TData, TVariables>(query: DocumentNode): UseQueryHook<TData, TVariables> {
  return (opts: QueryHookOptions<TData, TVariables>) => useQuery<TData, TVariables>(query, opts);
}

export default makeQuery;
