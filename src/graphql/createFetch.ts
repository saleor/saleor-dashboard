import { storage } from "@dashboard/auth/tokenStorage";
import { getApiUrl } from "@dashboard/config";
import jwtDecode from "jwt-decode";

interface JWTToken {
  owner: string;
  exp: number;
}

const isInternalToken = (owner: string): boolean => owner === "saleor";

let refreshPromise: Promise<{ token: string | null }> | null = null;

async function refreshInternalToken(apiUrl: string): Promise<{ token: string | null }> {
  const refreshToken = storage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("refreshToken not present");
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      operationName: "refreshToken",
      query: `mutation refreshToken($refreshToken: String!) {
        tokenRefresh(refreshToken: $refreshToken) {
          token
          errors { code }
        }
      }`,
      variables: { refreshToken },
    }),
  });
  const result = await res.json();
  const token: string | null = result.data?.tokenRefresh?.token ?? null;

  if (token) {
    storage.setAccessToken(token);
  } else {
    storage.clear();
  }

  return { token };
}

async function refreshExternalToken(apiUrl: string): Promise<{ token: string | null }> {
  const refreshToken = storage.getRefreshToken();
  const pluginId = storage.getAuthPluginId();

  if (!refreshToken) {
    throw new Error("refreshToken not present");
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      operationName: "externalRefresh",
      query: `mutation externalRefresh($pluginId: String!, $input: JSONString!) {
        externalRefresh(pluginId: $pluginId, input: $input) {
          token
          refreshToken
          errors { code }
        }
      }`,
      variables: {
        pluginId,
        input: JSON.stringify({ refreshToken }),
      },
    }),
  });
  const result = await res.json();
  const token: string | null = result.data?.externalRefresh?.token ?? null;
  const newRefreshToken: string | null = result.data?.externalRefresh?.refreshToken ?? null;

  if (token) {
    storage.setTokens({
      accessToken: token,
      refreshToken: newRefreshToken,
    });
  } else {
    storage.clear();
  }

  return { token };
}

async function doRefresh(apiUrl: string, owner: string): Promise<{ token: string | null }> {
  if (isInternalToken(owner)) {
    return refreshInternalToken(apiUrl);
  }

  return refreshExternalToken(apiUrl);
}

export type FetchConfig = Partial<{
  autoTokenRefresh: boolean;
  tokenRefreshTimeSkew: number;
  refreshOnUnauthorized: boolean;
}>;

export const createFetch =
  ({
    autoTokenRefresh = true,
    tokenRefreshTimeSkew = 120,
    refreshOnUnauthorized = true,
  }: FetchConfig = {}) =>
  async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
    const apiUrl = getApiUrl();
    let token = storage.getAccessToken();

    try {
      if (
        ["refreshToken", "externalRefresh"].includes(
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
      const decodedToken = jwtDecode<JWTToken>(token);
      const expirationTime = (decodedToken.exp - tokenRefreshTimeSkew) * 1000;
      const owner = decodedToken.owner;

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else if (Date.now() >= expirationTime) {
          refreshPromise = doRefresh(apiUrl, owner);
          await refreshPromise;
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
      const data = await response.clone().json();
      const isUnauthenticated = data?.errors?.some(
        (error: { extensions?: { exception?: Record<string, unknown> } }) =>
          error.extensions?.exception?.code === "ExpiredSignatureError",
      );
      const owner = jwtDecode<JWTToken>(token).owner;

      if (isUnauthenticated) {
        try {
          if (refreshPromise) {
            await refreshPromise;
          } else {
            refreshPromise = doRefresh(apiUrl, owner);
            await refreshPromise;
          }

          const newToken = storage.getAccessToken();

          if (newToken) {
            return createFetch({
              autoTokenRefresh: false,
              refreshOnUnauthorized: false,
            })(input, init);
          } else {
            storage.clear();
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
