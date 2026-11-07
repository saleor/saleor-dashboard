import { type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { registerAuthClient } from "@dashboard/graphql/authFetch";
import jwtDecode from "jwt-decode";

import { auth, type AuthSDK } from "./authSdk";
import {
  anotherAccountChosenVar,
  apiUnreachableVar,
  authStateVar,
  setAuthState,
} from "./authState";
import { isTransientRequestError, RequestTimeoutError } from "./errors";
import { createStorage, isInternalToken, type JWTToken, storage } from "./tokenStorage";

/** Waits before each retry of the boot-time autologin after the refresh request failed. */
const AUTOLOGIN_RETRY_DELAYS_MS: readonly number[] = [1000, 3000];

/**
 * How long to wait for the stored session's refresh. A Saleor that accepts the connection but
 * never answers would otherwise keep the loader, or a retry, waiting with no end.
 */
const REFRESH_TIMEOUT_MS = 15_000;

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let autologinSdk: AuthSDK | null = null;

/**
 * A refresh that timed out may still get its answer. Sending another with the same refresh token
 * meanwhile could be refused as a reuse by an SSO provider that rotates tokens, which logs out,
 * so a retry waits on the one still running.
 */
let pendingRefresh: { refreshToken: string; promise: Promise<unknown> } | null = null;

const startRefresh = (authSdk: AuthSDK, refreshToken: string): Promise<unknown> => {
  if (pendingRefresh?.refreshToken === refreshToken) {
    return pendingRefresh.promise;
  }

  const promise = isInternalToken(jwtDecode<JWTToken>(refreshToken).owner)
    ? authSdk.refreshToken(true)
    : authSdk.refreshExternalToken(true);
  const settled = (): void => {
    if (pendingRefresh?.promise === promise) {
      pendingRefresh = null;
    }
  };

  pendingRefresh = { refreshToken, promise };
  promise.then(settled, settled);

  return promise;
};

/**
 * Refreshes the stored session, failing with a `RequestTimeoutError` if the API doesn't answer in
 * time. A late answer still applies, like any other refresh.
 */
const refreshStoredSession = (authSdk: AuthSDK, refreshToken: string): Promise<unknown> => {
  const refresh = startRefresh(authSdk, refreshToken);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new RequestTimeoutError()), REFRESH_TIMEOUT_MS);
  });

  return Promise.race([refresh, timeout]).finally(() => clearTimeout(timer));
};

/**
 * Refreshes the stored session at boot. A refresh the API refuses logs out inside the SDK. A
 * refresh request that fails quickly (offline, a 502 or 503) is retried a few times; one that
 * gets no answer in time isn't, since the loader has already shown for long. If it still fails,
 * the app shows that Saleor can't be reached and keeps the stored refresh token, so the session
 * can still be used once the API answers.
 */
const autologin = async (authSdk: AuthSDK, refreshToken: string): Promise<void> => {
  for (let attempt = 0; ; attempt++) {
    try {
      await refreshStoredSession(authSdk, refreshToken);

      return;
    } catch (error) {
      // A late answer to an earlier attempt may have opened the session already.
      if (authStateVar().authenticated) {
        return;
      }

      const delay =
        error instanceof RequestTimeoutError ? undefined : AUTOLOGIN_RETRY_DELAYS_MS[attempt];

      if (!isTransientRequestError(error) || delay === undefined) {
        setAuthState({ authenticating: false });
        apiUnreachableVar(isTransientRequestError(error));

        return;
      }

      await wait(delay);

      // A login, a logout, or a late answer may have settled it while waiting.
      if (storage.getRefreshToken() !== refreshToken || authStateVar().authenticated) {
        return;
      }
    }
  }
};

/**
 * Tries the stored session again after the startup autologin couldn't reach Saleor. A refresh
 * that still fails on the network keeps the app on the "can't reach Saleor" state; any answer
 * from the API (a session, or a refusal that logs out) leaves it.
 */
export const retryAutologin = async (): Promise<void> => {
  const refreshToken = storage.getRefreshToken();

  if (!autologinSdk || !refreshToken) {
    apiUnreachableVar(false);

    return;
  }

  try {
    await refreshStoredSession(autologinSdk, refreshToken);
    apiUnreachableVar(false);
  } catch (error) {
    if (!isTransientRequestError(error)) {
      apiUnreachableVar(false);
    }
  }
};

/**
 * Leaves the "can't reach Saleor" state for the sign-in screen. The merchant chose another
 * account, so the browser's saved password doesn't sign the stored one back in by itself.
 */
export const showSignIn = (): void => {
  anotherAccountChosenVar(true);
  apiUnreachableVar(false);
};

/**
 * Wires auth onto the app's single Apollo client and kicks off the boot-time autologin.
 *
 * The order matters: `createFetch` (already baked into the client's link) needs an auth client to
 * run refresh mutations through, and that client needs the Apollo client to exist first. Building
 * the Apollo client and then registering back into `authFetch` breaks the cycle.
 */
export const initAuth = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { autologin: autologinEnabled = true }: { autologin?: boolean } = {},
): AuthSDK => {
  createStorage(autologinEnabled);

  const authSdk = auth({ apolloClient });

  autologinSdk = authSdk;
  registerAuthClient(authSdk);

  const refreshToken = storage.getRefreshToken();

  // A stored refresh token means the autologin below is about to run, so the app must not flash
  // the login screen while it does.
  setAuthState({ authenticating: autologinEnabled && !!refreshToken });

  if (autologinEnabled && refreshToken) {
    void autologin(authSdk, refreshToken);
  }

  return authSdk;
};
