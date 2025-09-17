import {
  ExternalAuthenticationUrlMutation,
  ExternalAuthenticationUrlMutationVariables,
  ExternalLogoutMutation,
  ExternalLogoutMutationVariables,
  ExternalObtainAccessTokensMutation,
  ExternalObtainAccessTokensMutationVariables,
  ExternalRefreshMutation,
  ExternalRefreshMutationVariables,
  ExternalRefreshWithUserMutation,
  ExternalRefreshWithUserMutationVariables,
  ExternalVerifyMutation,
  ExternalVerifyMutationVariables,
  LoginMutation,
  LoginMutationVariables,
  PasswordChangeMutation,
  PasswordChangeMutationVariables,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
  RefreshTokenWithUserMutation,
  RefreshTokenWithUserMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables,
  SetPasswordMutation,
  SetPasswordMutationVariables,
  VerifyTokenMutation,
  VerifyTokenMutationVariables,
} from "@dashboard/graphql";

import {
  CHANGE_USER_PASSWORD,
  EXTERNAL_AUTHENTICATION_URL,
  EXTERNAL_LOGOUT,
  EXTERNAL_REFRESH,
  EXTERNAL_REFRESH_WITH_USER,
  EXTERNAL_VERIFY_TOKEN,
  LOGIN,
  LOGIN_WITHOUT_DETAILS,
  OBTAIN_EXTERNAL_ACCESS_TOKEN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_WITH_USER,
  REGISTER,
  REQUEST_PASSWORD_RESET,
  SET_PASSWORD,
  VERIFY_TOKEN,
} from "../apollo/mutations";
import { USER, USER_WITHOUT_DETAILS } from "../apollo/queries";
import { hasNonEmptyPermissions } from "./helpers";
import { storage } from "./storage";
import {
  ChangePasswordOpts,
  ChangePasswordResult,
  GetExternalAccessTokenOpts,
  GetExternalAccessTokenResult,
  GetExternalAuthUrlOpts,
  GetExternalAuthUrlResult,
  LoginOpts,
  LoginResult,
  LogoutOpts,
  LogoutResult,
  RefreshExternalTokenResult,
  RefreshTokenResult,
  RegisterOpts,
  RegisterResult,
  RequestPasswordResetOpts,
  RequestPasswordResetResult,
  SaleorClientMethodsProps,
  SetPasswordOpts,
  SetPasswordResult,
  VerifyExternalTokenResult,
  VerifyTokenResult,
} from "./types";

export interface AuthSDK {
  /**
   * Change the password of the logged in user.
   *
   * @param opts - Object with password and new password.
   * @returns Errors if the passoword change has failed.
   */
  changePassword: (opts: ChangePasswordOpts) => Promise<ChangePasswordResult>;
  /**
   * Authenticates user with email and password.
   *
   * @param opts - Object with user's email, password and a boolean includeDetails - whether to fetch user details.
   * Default for includeDetails is true.
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
   * Refresh JWT token. Mutation will try to take refreshToken from the function's arguments.
   * If it fails, it will try to use refreshToken from the http-only cookie called refreshToken.
   *
   * @param includeUser - Whether to fetch user. Default false.
   * @returns Authorization token.
   */
  refreshToken: (includeUser?: boolean) => Promise<RefreshTokenResult>;
  /**
   * Registers user with email and password.
   *
   * @param opts - Object with user's data. Email and password are required fields.
   * "channel" can be changed by using first "setChannel" method from api.
   * @returns Promise resolved with AccountRegister type data.
   */
  register: (opts: RegisterOpts) => Promise<RegisterResult>;
  /**
   * Sends an email with the account password modification link.
   *
   * @param opts - Object with slug of a channel which will be used for notify user,
   * email of the user that will be used for password recovery and URL of a view
   * where users should be redirected to reset the password. URL in RFC 1808 format.
   *
   * @returns Errors if there were some.
   */
  requestPasswordReset: (opts: RequestPasswordResetOpts) => Promise<RequestPasswordResetResult>;
  /**
   * Sets the user's password from the token sent by email.
   *
   * @param opts - Object with user's email, password and one-time token required to set the password.
   * @returns User instance, JWT token, JWT refresh token and CSRF token.
   */
  setPassword: (opts: SetPasswordOpts) => Promise<SetPasswordResult>;
  /**
   * Verify JWT token.
   *
   * @param token - Token value.
   * @returns User assigned to token and the information if the token is valid or not.
   */
  verifyToken: () => Promise<VerifyTokenResult>;
  /**
   * Executing externalAuthenticationUrl mutation will prepare special URL which will redirect user to requested
   * page after successfull authentication. After redirection state and code fields will be added to the URL.
   *
   * @param opts - Object withpluginId default value set as "mirumee.authentication.openidconnect" and input as
   * JSON with redirectUrl - the URL where the user should be redirected after successful authentication.
   * @returns Authentication data and errors
   */
  getExternalAuthUrl: (opts: GetExternalAuthUrlOpts) => Promise<GetExternalAuthUrlResult>;
  /**
   * The externalObtainAccessTokens mutation will generate requested access tokens.
   *
   * @param opts - Object withpluginId default value set as "mirumee.authentication.openidconnect" and input as
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
  /**
   * The mutation will verify the authentication token.
   *
   * @returns Token verification data and errors
   */
  verifyExternalToken: () => Promise<VerifyExternalTokenResult>;
}

export const auth = ({ apolloClient: client, channel }: SaleorClientMethodsProps): AuthSDK => {
  const login: AuthSDK["login"] = ({ includeDetails = true, ...opts }) => {
    const query = includeDetails ? USER : USER_WITHOUT_DETAILS;
    const loginMutation = includeDetails ? LOGIN : LOGIN_WITHOUT_DETAILS;

    client.writeQuery({
      query,
      data: {
        authenticating: true,
      },
    });

    return client.mutate<LoginMutation, LoginMutationVariables>({
      mutation: loginMutation,
      variables: {
        ...opts,
      },
      update: (_, { data }) => {
        if (data?.tokenCreate?.token) {
          storage.setTokens({
            accessToken: data.tokenCreate.token,
            refreshToken: data.tokenCreate.refreshToken,
          });
        } else {
          client.writeQuery({
            query,
            data: {
              authenticating: false,
            },
          });
        }
      },
    });
  };

  const logout: AuthSDK["logout"] = async opts => {
    const authPluginId = storage.getAuthPluginId();

    storage.clear();

    client.writeQuery({
      query: USER,
      data: {
        authenticating: false,
      },
    });

    client.resetStore();

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

  const register: AuthSDK["register"] = async opts =>
    await client.mutate<RegisterMutation, RegisterMutationVariables>({
      mutation: REGISTER,
      variables: {
        input: {
          ...opts,
          channel,
        },
      },
    });

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
        update: (_, { data }) => {
          if (data?.tokenRefresh?.token) {
            storage.setAccessToken(data.tokenRefresh.token);
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

  const verifyToken: AuthSDK["verifyToken"] = async () => {
    const token = storage.getAccessToken();

    if (!token) {
      throw Error("Token not present");
    }

    const result = await client.mutate<VerifyTokenMutation, VerifyTokenMutationVariables>({
      mutation: VERIFY_TOKEN,
      variables: { token },
    });

    if (!result.data?.tokenVerify?.isValid) {
      logout();
    }

    return result;
  };

  const changePassword: AuthSDK["changePassword"] = async opts => {
    const result = await client.mutate<PasswordChangeMutation, PasswordChangeMutationVariables>({
      mutation: CHANGE_USER_PASSWORD,
      variables: { ...opts },
    });

    return result;
  };

  const requestPasswordReset: AuthSDK["requestPasswordReset"] = async opts => {
    const result = await client.mutate<
      RequestPasswordResetMutation,
      RequestPasswordResetMutationVariables
    >({
      mutation: REQUEST_PASSWORD_RESET,
      // todo something is wrong with this mutation
      variables: { ...opts, channel },
    });

    return result;
  };

  const setPassword: AuthSDK["setPassword"] = opts => {
    return client.mutate<SetPasswordMutation, SetPasswordMutationVariables>({
      mutation: SET_PASSWORD,
      variables: { ...opts },
      update: (_, { data }) => {
        if (data?.setPassword?.token) {
          storage.setTokens({
            accessToken: data.setPassword.token,
            refreshToken: data.setPassword.refreshToken,
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
    client.writeQuery({
      query: USER,
      data: {
        authenticating: true,
      },
    });

    return client.mutate<
      ExternalObtainAccessTokensMutation,
      ExternalObtainAccessTokensMutationVariables
    >({
      mutation: OBTAIN_EXTERNAL_ACCESS_TOKEN,
      variables: {
        ...opts,
      },
      update: (_, { data }) => {
        storage.setAuthPluginId(opts.pluginId ?? null);

        if (
          data?.externalObtainAccessTokens?.token &&
          hasNonEmptyPermissions(data?.externalObtainAccessTokens?.user?.userPermissions)
        ) {
          storage.setTokens({
            accessToken: data.externalObtainAccessTokens.token,
            refreshToken: data.externalObtainAccessTokens.refreshToken,
          });
        } else {
          client.writeQuery({
            query: USER,
            data: {
              authenticating: false,
            },
          });
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

  const verifyExternalToken: AuthSDK["verifyExternalToken"] = async () => {
    const refreshToken = storage.getRefreshToken();
    const authPluginId = storage.getAuthPluginId();

    if (!refreshToken) {
      throw Error("refreshToken not present");
    }

    const result = await client.mutate<ExternalVerifyMutation, ExternalVerifyMutationVariables>({
      mutation: EXTERNAL_VERIFY_TOKEN,
      variables: {
        pluginId: authPluginId,
        input: JSON.stringify({
          refreshToken,
        }),
      },
    });

    if (!result.data?.externalVerify?.isValid) {
      storage.clear();
    }

    return result;
  };

  return {
    changePassword,
    getExternalAccessToken,
    getExternalAuthUrl,
    login,
    logout,
    refreshExternalToken,
    refreshToken,
    register,
    requestPasswordReset,
    setPassword,
    verifyExternalToken,
    verifyToken,
  };
};
