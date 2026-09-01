import { type ApolloCache, type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import {
  ExternalAuthenticationUrlDocument as EXTERNAL_AUTHENTICATION_URL,
  type ExternalAuthenticationUrlMutation,
  type ExternalAuthenticationUrlMutationVariables,
  ExternalLogoutDocument as EXTERNAL_LOGOUT,
  type ExternalLogoutMutation,
  type ExternalLogoutMutationVariables,
  ExternalObtainAccessTokensDocument as OBTAIN_EXTERNAL_ACCESS_TOKEN,
  type ExternalObtainAccessTokensMutation,
  type ExternalObtainAccessTokensMutationVariables,
  ExternalRefreshDocument as EXTERNAL_REFRESH,
  type ExternalRefreshMutation,
  type ExternalRefreshMutationVariables,
  ExternalRefreshWithUserDocument as EXTERNAL_REFRESH_WITH_USER,
  type ExternalRefreshWithUserMutation,
  type ExternalRefreshWithUserMutationVariables,
  LoginDocument as LOGIN,
  type LoginMutation,
  type LoginMutationVariables,
  RefreshTokenDocument as REFRESH_TOKEN,
  type RefreshTokenMutation,
  type RefreshTokenMutationVariables,
  RefreshTokenWithUserDocument as REFRESH_TOKEN_WITH_USER,
  type RefreshTokenWithUserMutation,
  type RefreshTokenWithUserMutationVariables,
  SetPasswordDocument as SET_PASSWORD,
  type SetPasswordMutation,
  type SetPasswordMutationVariables,
  UserDetailsDocument as USER_DETAILS,
  type UserDetailsQuery,
  type UserFragment,
} from "@dashboard/graphql";

import { resetAuthState, setAuthState } from "./authState";
import { storage } from "./tokenStorage";
import {
  type GetExternalAccessTokenOpts,
  type GetExternalAccessTokenResult,
  type GetExternalAuthUrlOpts,
  type GetExternalAuthUrlResult,
  type LoginOpts,
  type LoginResult,
  type LogoutOpts,
  type LogoutResult,
  type RefreshExternalTokenResult,
  type RefreshTokenResult,
  type SetPasswordOpts,
  type SetPasswordResult,
} from "./types";

export interface AuthSDK {
  /**
   * Authenticates user with email and password.
   *
   * @param opts - Object with user's email and password.
   * @returns Promise resolved with CreateToken type data.
   */
  login: (opts: LoginOpts) => Promise<LoginResult>;
  /**
   * Clears stored token and Apollo store. If external plugin was used to log in, the mutation will prepare
   * the logout URL. All values passed in field input will be added as GET parameters to the logout request.
   *
   * @param opts - Object with input as JSON with returnTo - the URL where a user should be redirected
   * when external plugin was used to log in
   * @returns Logout data and errors if external plugin was used to log in. Otherwise null.
   */
  logout: (opts?: LogoutOpts) => Promise<LogoutResult>;
  /**
   * Refresh JWT token. Reads the refresh token from storage.
   *
   * @param includeUser - Whether to fetch user. Default false.
   * @returns Authorization token.
   */
  refreshToken: (includeUser?: boolean) => Promise<RefreshTokenResult>;
  /**
   * Sets the user's password from the token sent by email.
   *
   * @param opts - Object with user's email, password and one-time token required to set the password.
   * @returns User instance, JWT token, JWT refresh token and CSRF token.
   */
  setPassword: (opts: SetPasswordOpts) => Promise<SetPasswordResult>;
  /**
   * Executing externalAuthenticationUrl mutation will prepare special URL which will redirect user to requested
   * page after successful authentication. After redirection state and code fields will be added to the URL.
   *
   * @param opts - Object with pluginId default value set as "mirumee.authentication.openidconnect" and input as
   * JSON with redirectUrl - the URL where the user should be redirected after successful authentication.
   * @returns Authentication data and errors
   */
  getExternalAuthUrl: (opts: GetExternalAuthUrlOpts) => Promise<GetExternalAuthUrlResult>;
  /**
   * The externalObtainAccessTokens mutation will generate requested access tokens.
   *
   * @param opts - Object with pluginId default value set as "mirumee.authentication.openidconnect" and input as
   * JSON with code - the authorization code received from the OAuth provider and state - the state value received
   * from the OAuth provider
   * @returns Login authentication data and errors
   */
  getExternalAccessToken: (
    opts: GetExternalAccessTokenOpts,
  ) => Promise<GetExternalAccessTokenResult>;
  /**
   * The externalRefresh mutation will generate new access tokens when provided with a valid refresh token.
   *
   * @param includeUser - Whether to fetch user. Default false.
   * @returns Token refresh data and errors
   */
  refreshExternalToken: (includeUser?: boolean) => Promise<RefreshExternalTokenResult>;
}

export const auth = ({
  apolloClient: client,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}): AuthSDK => {
  /**
   * Auth mutations return the same `User` fragment as `UserDetails`, but Apollo normalises them
   * under `User:<id>` without ever recording `ROOT_QUERY.me`. Seeding it here lets the
   * `UserDetails` query read straight from cache, so login/autologin costs one request, not two.
   */
  const seedUserQuery = (cache: ApolloCache<NormalizedCacheObject>, user?: UserFragment | null) => {
    if (user) {
      cache.writeQuery<UserDetailsQuery>({
        query: USER_DETAILS,
        data: { __typename: "Query", me: user },
      });
    }
  };

  const login: AuthSDK["login"] = opts => {
    setAuthState({ authenticating: true });

    return client.mutate<LoginMutation, LoginMutationVariables>({
      mutation: LOGIN,
      variables: {
        ...opts,
      },
      update: (cache, { data }) => {
        if (data?.tokenCreate?.token) {
          seedUserQuery(cache, data.tokenCreate.user);
          storage.setTokens({
            accessToken: data.tokenCreate.token,
            refreshToken: data.tokenCreate.refreshToken,
          });
          setAuthState({
            authenticated: true,
            authenticating: false,
            isStaff: !!data.tokenCreate.user?.isStaff,
          });
        } else {
          setAuthState({ authenticating: false });
        }
      },
    });
  };

  const logout: AuthSDK["logout"] = async opts => {
    const authPluginId = storage.getAuthPluginId();

    storage.clear();
    resetAuthState();

    // `clearStore`, not `resetStore`: now that auth shares the app's single client, `resetStore`
    // would refetch every active Dashboard query the instant the token is gone, and each one
    // would 401.
    client.clearStore();

    if (authPluginId && opts?.input) {
      const result = await client.mutate<ExternalLogoutMutation, ExternalLogoutMutationVariables>({
        mutation: EXTERNAL_LOGOUT,
        variables: {
          ...opts,
          pluginId: authPluginId,
        },
      });

      return result;
    }

    return null;
  };

  const refreshToken: AuthSDK["refreshToken"] = (includeUser = false) => {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      throw Error("refreshToken not present");
    }

    if (includeUser) {
      return client.mutate<RefreshTokenWithUserMutation, RefreshTokenWithUserMutationVariables>({
        mutation: REFRESH_TOKEN_WITH_USER,
        variables: {
          refreshToken,
        },
        update: (cache, { data }) => {
          if (data?.tokenRefresh?.token) {
            seedUserQuery(cache, data.tokenRefresh.user);
            storage.setAccessToken(data.tokenRefresh.token);
            setAuthState({
              authenticated: true,
              authenticating: false,
              isStaff: !!data.tokenRefresh.user?.isStaff,
            });
          } else {
            logout();
          }
        },
      });
    }

    return client.mutate<RefreshTokenMutation, RefreshTokenMutationVariables>({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken,
      },
      update: (_, { data }) => {
        if (data?.tokenRefresh?.token) {
          storage.setAccessToken(data.tokenRefresh.token);
        } else {
          logout();
        }
      },
    });
  };

  const setPassword: AuthSDK["setPassword"] = opts => {
    return client.mutate<SetPasswordMutation, SetPasswordMutationVariables>({
      mutation: SET_PASSWORD,
      variables: { ...opts },
      update: (cache, { data }) => {
        if (data?.setPassword?.token) {
          seedUserQuery(cache, data.setPassword.user);
          storage.setTokens({
            accessToken: data.setPassword.token,
            refreshToken: data.setPassword.refreshToken,
          });
          setAuthState({
            authenticated: true,
            authenticating: false,
            isStaff: !!data.setPassword.user?.isStaff,
          });
        }
      },
    });
  };

  const getExternalAuthUrl: AuthSDK["getExternalAuthUrl"] = async opts => {
    const result = await client.mutate<
      ExternalAuthenticationUrlMutation,
      ExternalAuthenticationUrlMutationVariables
    >({
      mutation: EXTERNAL_AUTHENTICATION_URL,
      variables: { ...opts },
    });

    return result;
  };

  const getExternalAccessToken: AuthSDK["getExternalAccessToken"] = opts => {
    setAuthState({ authenticating: true });

    return client.mutate<
      ExternalObtainAccessTokensMutation,
      ExternalObtainAccessTokensMutationVariables
    >({
      mutation: OBTAIN_EXTERNAL_ACCESS_TOKEN,
      variables: {
        ...opts,
      },
      update: (cache, { data }) => {
        storage.setAuthPluginId(opts.pluginId ?? null);
        seedUserQuery(cache, data?.externalObtainAccessTokens?.user);

        if (
          data?.externalObtainAccessTokens?.token &&
          !!data.externalObtainAccessTokens.user?.userPermissions?.length
        ) {
          storage.setTokens({
            accessToken: data.externalObtainAccessTokens.token,
            refreshToken: data.externalObtainAccessTokens.refreshToken,
          });
          setAuthState({
            authenticated: true,
            authenticating: false,
            isStaff: !!data.externalObtainAccessTokens.user?.isStaff,
          });
        } else {
          setAuthState({ authenticating: false });
        }
      },
    });
  };

  const refreshExternalToken: AuthSDK["refreshExternalToken"] = (includeUser = false) => {
    const refreshToken = storage.getRefreshToken();
    const authPluginId = storage.getAuthPluginId();

    if (!refreshToken) {
      throw Error("refreshToken not present");
    }

    if (includeUser) {
      return client.mutate<
        ExternalRefreshWithUserMutation,
        ExternalRefreshWithUserMutationVariables
      >({
        mutation: EXTERNAL_REFRESH_WITH_USER,
        variables: {
          pluginId: authPluginId,
          input: JSON.stringify({
            refreshToken,
          }),
        },
        update: (cache, { data }) => {
          if (data?.externalRefresh?.token) {
            seedUserQuery(cache, data.externalRefresh.user);
            storage.setTokens({
              accessToken: data.externalRefresh.token,
              refreshToken: data.externalRefresh.refreshToken,
            });
            setAuthState({
              authenticated: true,
              authenticating: false,
              isStaff: !!data.externalRefresh.user?.isStaff,
            });
          } else {
            logout();
          }
        },
      });
    }

    return client.mutate<ExternalRefreshMutation, ExternalRefreshMutationVariables>({
      mutation: EXTERNAL_REFRESH,
      variables: {
        pluginId: authPluginId,
        input: JSON.stringify({
          refreshToken,
        }),
      },
      update: (_, { data }) => {
        if (data?.externalRefresh?.token) {
          storage.setTokens({
            accessToken: data.externalRefresh.token,
            refreshToken: data.externalRefresh.refreshToken,
          });
        } else {
          logout();
        }
      },
    });
  };

  return {
    getExternalAccessToken,
    getExternalAuthUrl,
    login,
    logout,
    refreshExternalToken,
    refreshToken,
    setPassword,
  };
};
