import { type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { registerAuthClient } from "@dashboard/graphql/authFetch";
import jwtDecode from "jwt-decode";

import { auth, type AuthSDK } from "./authSdk";
import { apiUnreachableVar, setAuthState } from "./authState";
import { isTransientRequestError } from "./errors";
import { createStorage, isInternalToken, type JWTToken, storage } from "./tokenStorage";

/** Waits before each retry of the boot-time autologin after the refresh request failed. */
const AUTOLOGIN_RETRY_DELAYS_MS: readonly number[] = [1000, 3000];

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let autologinSdk: AuthSDK | null = null;

const refreshStoredSession = (authSdk: AuthSDK, refreshToken: string): Promise<unknown> =>
  isInternalToken(jwtDecode<JWTToken>(refreshToken).owner)
    ? authSdk.refreshToken(true)
    : authSdk.refreshExternalToken(true);

/**
 * Refreshes the stored session at boot. A refresh the API refuses logs out inside the SDK. A
 * refresh request that fails (offline, a timeout, a 502 or 503) is retried a few times; if it
 * still fails, the app shows that Saleor can't be reached and keeps the stored refresh token, so
 * the session can still be used once the API answers.
 */
const autologin = async (authSdk: AuthSDK, refreshToken: string): Promise<void> => {
  for (let attempt = 0; ; attempt++) {
    try {
      await refreshStoredSession(authSdk, refreshToken);

      return;
    } catch (error) {
      const delay = AUTOLOGIN_RETRY_DELAYS_MS[attempt];

      if (!isTransientRequestError(error) || delay === undefined) {
        setAuthState({ authenticating: false });
        apiUnreachableVar(isTransientRequestError(error));

        return;
      }

      await wait(delay);

      // A login or logout may have happened while waiting.
      if (storage.getRefreshToken() !== refreshToken) {
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

/** Leaves the "can't reach Saleor" state for the sign-in screen. */
export const showSignIn = (): void => {
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
