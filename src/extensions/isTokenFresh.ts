import jwt_decode from "jwt-decode";

/**
 * True when the app JWT is still valid at least `marginMs` from now.
 *
 * The margin guards against opening an extension with a token that would expire
 * mid-handshake. Tokens we can't decode, or that carry no `exp`, return `true` -
 * we can't prove they're stale, so we don't block on them (the empty-token case
 * is handled separately by the caller).
 */
export const isTokenFresh = (token: string, marginMs = 5000): boolean => {
  try {
    const { exp } = jwt_decode<{ exp?: number }>(token);

    if (!exp) {
      return true;
    }

    return exp * 1000 > Date.now() + marginMs;
  } catch {
    return true;
  }
};
