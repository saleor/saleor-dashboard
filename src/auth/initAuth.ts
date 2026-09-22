import { type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { registerAuthClient } from "@dashboard/graphql/authFetch";
import jwtDecode from "jwt-decode";

import { auth, type AuthSDK } from "./authSdk";
import { setAuthState } from "./authState";
import { createStorage, isInternalToken, type JWTToken, storage } from "./tokenStorage";

/**
 * Wires auth onto the app's single Apollo client and kicks off the boot-time autologin.
 *
 * The order matters: `createFetch` (already baked into the client's link) needs an auth client to
 * run refresh mutations through, and that client needs the Apollo client to exist first. Building
 * the Apollo client and then registering back into `authFetch` breaks the cycle.
 */
export const initAuth = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { autologin = true }: { autologin?: boolean } = {},
): AuthSDK => {
  createStorage(autologin);

  const authSdk = auth({ apolloClient });

  registerAuthClient(authSdk);

  const refreshToken = storage.getRefreshToken();

  // A stored refresh token means the autologin below is about to run, so the app must not flash
  // the login screen while it does.
  setAuthState({ authenticating: autologin && !!refreshToken });

  if (autologin && refreshToken) {
    const owner = jwtDecode<JWTToken>(refreshToken).owner;

    if (isInternalToken(owner)) {
      authSdk.refreshToken(true);
    } else {
      authSdk.refreshExternalToken(true);
    }
  }

  return authSdk;
};
