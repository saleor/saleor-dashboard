import {
  ApolloClient,
  createHttpLink,
  type FetchResult,
  InMemoryCache,
  type NormalizedCacheObject,
  type Reference,
} from "@apollo/client";
import jwtDecode from "jwt-decode";

import { type JWTToken } from "../core";
import { auth, type AuthSDK } from "../core/auth";
import { storage } from "../core/storage";
import { isInternalToken } from "../helpers";
import { type TypedTypePolicies } from "./apollo-helpers";
import { type ExternalRefreshMutation, type RefreshTokenMutation } from "./types";

let client: ApolloClient<NormalizedCacheObject>;
let authClient: AuthSDK;
let refreshPromise:
  | ReturnType<AuthSDK["refreshToken"]>
  | ReturnType<AuthSDK["refreshExternalToken"]>
  | null = null;
const isTokenRefreshExternal = (
  result: RefreshTokenMutation | ExternalRefreshMutation,
): result is ExternalRefreshMutation => "externalRefresh" in result;

export type FetchConfig = Partial<{
  /**
   * Enable auto token refreshing. Default to `true`.
   */
  autoTokenRefresh: boolean;
  /**
   * Set a value for skew between local time and token expiration date in
   * seconds (only together with `autoTokenRefresh`). Defaults to `120`.
   */
  tokenRefreshTimeSkew: number;
  /**
   * Refresh token and retry the request when Saleor responds with `Unauthorized` error.
   * Defaults to `true`.
   */
  refreshOnUnauthorized: boolean;
}>;

export const createFetch =
  ({
    autoTokenRefresh = true,
    tokenRefreshTimeSkew = 120,
    refreshOnUnauthorized = true,
  }: FetchConfig = {}) =>
  async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
    if (!client) {
      throw new Error(
        "Could not find Saleor's client instance. Did you forget to call createSaleorClient()?",
      );
    }

    let token = storage.getAccessToken();

    try {
      if (
        ["refreshToken", "externalRefresh"].includes(
          // INFO: Non-null assertion is enabled because the block is wrapped inside try/catch
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          JSON.parse(init.body!.toString()).operationName,
        )
      ) {
        return fetch(input, init);
      }
    } catch {
      // ignore
    }

    if (autoTokenRefresh && token) {
      // auto refresh token before provided time skew (in seconds) until it expires
      const decodedToken = jwtDecode<JWTToken>(token);
      const expirationTime = (decodedToken.exp - tokenRefreshTimeSkew) * 1000;
      const owner = decodedToken.owner;

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else if (Date.now() >= expirationTime) {
          if (isInternalToken(owner)) {
            await authClient.refreshToken();
          } else {
            await authClient.refreshExternalToken();
          }
        }
      } catch {
        // ignore
      } finally {
        refreshPromise = null;
      }

      token = storage.getAccessToken();
    }

    if (token) {
      init.headers = {
        ...init.headers,
        "authorization-bearer": token,
      };
    }

    if (refreshOnUnauthorized && token) {
      const response = await fetch(input, init);
      const data: FetchResult = await response.clone().json();
      const isUnauthenticated = data?.errors?.some(
        error =>
          (error.extensions?.exception as Record<string, unknown>)?.code ===
          "ExpiredSignatureError",
      );
      let refreshTokenResponse: FetchResult<
        RefreshTokenMutation | ExternalRefreshMutation,
        Record<string, unknown>,
        Record<string, unknown>
      > | null = null;
      const owner = jwtDecode<JWTToken>(token).owner;

      if (isUnauthenticated) {
        try {
          if (refreshPromise) {
            refreshTokenResponse = await refreshPromise;
          } else {
            refreshPromise = isInternalToken(owner)
              ? authClient.refreshToken()
              : authClient.refreshExternalToken();
            refreshTokenResponse = await refreshPromise;
          }

          if (
            refreshTokenResponse.data && isTokenRefreshExternal(refreshTokenResponse.data)
              ? refreshTokenResponse.data.externalRefresh?.token
              : (refreshTokenResponse.data as RefreshTokenMutation | undefined)?.tokenRefresh?.token
          ) {
            // check if mutation returns a valid token after refresh and retry the request
            return createFetch({
              autoTokenRefresh: false,
              refreshOnUnauthorized: false,
            })(input, init);
          } else {
            // after Saleor returns ExpiredSignatureError status and token refresh fails
            // we log out the user and return the failed response
            authClient.logout();
          }
        } catch {
          // ignore
        } finally {
          refreshPromise = null;
        }
      }

      return response;
    }

    return fetch(input, init);
  };

const getTypePolicies = (autologin: boolean): TypedTypePolicies => ({
  Query: {
    fields: {
      authenticated: {
        read(_, { readField, toReference }): boolean {
          return !!readField(
            "id",
            toReference({
              __typename: "User",
            }),
          );
        },
      },
      me: {
        read(_, { toReference, canRead }): Reference | undefined | null {
          const ref = toReference({
            __typename: "User",
          });

          return canRead(ref) ? ref : null;
        },
      },
      authenticating: {
        read(read = autologin && !!storage.getRefreshToken(), { readField }): boolean {
          if (readField("authenticated")) {
            return false;
          }

          return read;
        },
      },
    },
  },
  User: {
    /**
     * IMPORTANT
     * This works as long as we have 1 User cache object which is the current logged in User.
     * If the client should ever fetch additional Users, this should be removed
     * and the login methods (token create or verify) should be responsible for writing USER query cache manually.
     */
    keyFields: [],
    fields: {
      addresses: {
        merge: false,
      },
    },
  },
});

export const createApolloClient = (
  apiUrl: string,
  autologin: boolean,
  fetchOptions?: FetchConfig,
): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    fetch: createFetch(fetchOptions),
    uri: apiUrl,
    credentials: "include",
  });

  const cache = new InMemoryCache({
    typePolicies: getTypePolicies(autologin),
  });

  client = new ApolloClient({
    cache,
    link: httpLink,
  });

  /**
   * Refreshing token code should stay under core/auth.ts To get this method available,
   * we need to call "auth()" here.
   */
  authClient = auth({ apolloClient: client });

  return client;
};
