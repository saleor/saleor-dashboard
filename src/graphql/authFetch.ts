import { type FetchResult } from "@apollo/client";
import { type AuthSDK } from "@dashboard/auth/authSdk";
import {
  getTransientRequestError,
  isTransientRequestError,
  SessionEndedError,
} from "@dashboard/auth/errors";
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
/** The session the shared refresh belongs to; a new session never waits on an old refresh. */
let refreshSessionId: number | null = null;
const isTokenRefreshExternal = (
  result: RefreshTokenMutation | ExternalRefreshMutation,
): result is ExternalRefreshMutation => "externalRefresh" in result;
const getRefreshedToken = (
  result: RefreshTokenMutation | ExternalRefreshMutation | null | undefined,
): string | null | undefined =>
  result && isTokenRefreshExternal(result)
    ? result.externalRefresh?.token
    : (result as RefreshTokenMutation | undefined)?.tokenRefresh?.token;

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
  if (refreshPromise && refreshSessionId === storage.getSessionId()) {
    return refreshPromise;
  }

  const pending = isInternalToken(owner)
    ? authClient!.refreshToken()
    : authClient!.refreshExternalToken();

  refreshPromise = pending;
  refreshSessionId = storage.getSessionId();

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

/**
 * Forces a session refresh through the same single-flight path GraphQL requests use, for callers
 * that need claims from a fresh access token outside Apollo (e.g. the Saleor Cloud API token).
 *
 * @public Used by the Saleor Cloud extensions.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const token = storage.getAccessToken();

  if (!authClient || !token) {
    return null;
  }

  const sessionId = storage.getSessionId();

  await runTokenRefresh(jwtDecode<JWTToken>(token).owner);

  // A logout or another login while waiting: the caller asked for the previous session's token.
  return storage.getSessionId() === sessionId ? storage.getAccessToken() : null;
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
          // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
          JSON.parse(init.body!.toString()).operationName,
        )
      ) {
        return fetch(input, init);
      }
    } catch {
      // ignore
    }

    const sessionId = storage.getSessionId();
    // A logout or another login happened while this request waited for a token refresh. The
    // request belongs to a session that is gone, so it must not be retried with, or answered for,
    // the new one.
    const hasSessionEnded = (): boolean => storage.getSessionId() !== sessionId;

    if (autoTokenRefresh && token) {
      // auto refresh token before provided time skew (in seconds) until it expires
      const decodedToken = jwtDecode<JWTToken>(token);
      const expirationTime = (decodedToken.exp - tokenRefreshTimeSkew) * 1000;
      const owner = decodedToken.owner;

      try {
        if (refreshPromise && refreshSessionId === sessionId) {
          await refreshPromise;
        } else if (Date.now() >= expirationTime) {
          await runTokenRefresh(owner);
        }
      } catch {
        // ignore
      }

      if (hasSessionEnded()) {
        throw new SessionEndedError();
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
      // A proxy's error page (a 502 or 503 while Saleor is down) isn't JSON. It can't carry an
      // expired-token error, so hand it on: Apollo reports it with its status, which tells a
      // connection failure apart from an error Saleor returned.
      const data: FetchResult | null = await response
        .clone()
        .json()
        .catch(() => null);
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
        } catch (error) {
          if (hasSessionEnded()) {
            throw new SessionEndedError();
          }

          // The refresh request itself failed (offline, a timeout, a 502 or 503), so the session
          // may still be valid. Report that failure instead of the expired-token response, which
          // the query and mutation error handlers treat as a logout. The next request refreshes
          // again.
          if (isTransientRequestError(error)) {
            throw getTransientRequestError(error);
          }

          return response;
        }

        const refreshed = !!getRefreshedToken(refreshTokenResponse.data);

        if (hasSessionEnded()) {
          // The refusal of this session's refresh token logged out (no session is stored now):
          // return the expired response, so the error handlers say the session expired.
          if (!refreshed && storage.getRefreshToken() === null) {
            return response;
          }

          throw new SessionEndedError();
        }

        if (refreshed) {
          // check if mutation returns a valid token after refresh and retry the request
          return createFetch({
            autoTokenRefresh: false,
            refreshOnUnauthorized: false,
          })(input, init);
        }

        // The API refused the refresh token: log out and return the failed response.
        authClient.logout();
      }

      return response;
    }

    return fetch(input, init);
  };
