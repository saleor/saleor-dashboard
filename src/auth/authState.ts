import { makeVar, useReactiveVar } from "@apollo/client";

interface AuthState {
  /** A login, refresh or set-password mutation has returned a usable token. */
  authenticated: boolean;
  /** A token exchange is in flight — either the boot-time autologin or an explicit login. */
  authenticating: boolean;
  /** Whether the authenticated user may access the Dashboard at all. */
  isStaff: boolean;
}

/**
 * Session state, deliberately kept out of the Apollo cache.
 *
 * The vendored SDK used to store this as `@client` fields on `Query`, which forced
 * `User: { keyFields: [] }` so `toReference({ __typename: "User" })` could find "the" user
 * without knowing its id. That is a storefront assumption — the Dashboard reads `User` by id in
 * staff lists, customer lists and permission groups, so a single shared cache cannot carry it.
 *
 * None of this is server data, so a reactive variable is the right home: it is settable from the
 * boot-time autologin (which runs at module load, outside React) and still drives re-renders
 * through `useReactiveVar`.
 */
export const authStateVar = makeVar<AuthState>({
  authenticated: false,
  authenticating: false,
  isStaff: false,
});

export const setAuthState = (patch: Partial<AuthState>): AuthState =>
  authStateVar({ ...authStateVar(), ...patch });

export const resetAuthState = (): AuthState =>
  authStateVar({ authenticated: false, authenticating: false, isStaff: false });

export const useAuthState = (): AuthState => useReactiveVar(authStateVar);
