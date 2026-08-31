import { type FetchResult } from "@apollo/client";
import { type AuthSDK } from "@dashboard/auth/authSdk";
import { isInternalToken, type JWTToken, storage } from "@dashboard/auth/tokenStorage";
import jwtDecode from "jwt-decode";

import { type ExternalRefreshMutation, type RefreshTokenMutation } from "./types.generated";

/**
 * Set by `initAuth` once the single Apollo client exists. `createFetch` is handed to the link at
 * client-construction time but only ever *runs* per request, so registration always lands first.
 */
let authClient: AuthSDK | null = null;

export const registerAuthClient = (sdk: AuthSDK): void => {
  authClient = sdk;
};

let refreshPromise:
  | ReturnType<AuthSDK["refreshToken"]>
  | ReturnType<AuthSDK["refreshExternalToken"]>
  | null = null;
const isTokenRefreshExternal = (
  result: RefreshTokenMutation | ExternalRefreshMutation,
): result is ExternalRefreshMutation => "externalRefresh" in result;

/**
 * Single-flight token refresh shared by every in-flight request.
 *
 * When a slept tab wakes up, Apollo replays all of its active queries at once
 * and each one finds the same expired token. Without coalescing, that fans out
 * into one refresh mutation per request, and each response invalidates the
 * others' tokens. Only the call that started the refresh clears the shared
 * promise, so a caller that merely awaits it can never drop the reference while
 * the request is still running.
 */
const runTokenRefresh = (owner: string) => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const pending = isInternalToken(owner)
    ? authClient!.refreshToken()
    : authClient!.refreshExternalToken();

  refreshPromise = pending;

  void pending
    .finally(() => {
      if (refreshPromise === pending) {
        refreshPromise = null;
      }
    })
    // Rejections are surfaced to whoever awaits `pending`; this only keeps the
    // bookkeeping chain itself from becoming an unhandled rejection.
    .catch(() => undefined);

  return pending;
};

type FetchConfig = Partial<{
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
    if (!authClient) {
      throw new Error("Could not find Saleor's auth client. Did you forget to call initAuth()?");
    }

    let token = storage.getAccessToken();

    try {
      if (
        // Must match the operation names in src/auth/mutations.ts — a miss here makes a refresh
        // request try to refresh itself.
        [
          "RefreshToken",
          "RefreshTokenWithUser",
          "ExternalRefresh",
          "ExternalRefreshWithUser",
        ].includes(
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
          await runTokenRefresh(owner);
        }
      } catch {
        // ignore
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
          refreshTokenResponse = await runTokenRefresh(owner);

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
        }
      }

      return response;
    }

    return fetch(input, init);
  };
