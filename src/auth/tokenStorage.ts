const LOCAL_STORAGE_EXISTS = typeof window !== "undefined" && !!window.localStorage;

/**
 * Public contract: Playwright seeds `_saleorRefreshToken` directly (playwright/utils/auth.ts,
 * playwright/tests/auth.setup.ts) and `src/auth/hooks/useCloud.ts` reads `_saleorAuthPluginId`
 * by hand. Do not rename either key.
 */
export const SALEOR_AUTH_PLUGIN_ID = "_saleorAuthPluginId";
export const SALEOR_REFRESH_TOKEN = "_saleorRefreshToken";

export type JWTToken = {
  iat: number;
  iss: string;
  owner: string;
  exp: number;
  token: string;
  email: string;
  type: string;
  user_id: string;
  is_staff: boolean;
};

/** Tokens minted by Saleor itself refresh differently to ones minted by an external auth plugin. */
export const isInternalToken = (owner: string): boolean => owner === "saleor";

export let storage: {
  setAuthPluginId: (method: string | null) => void;
  getAuthPluginId: () => string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { accessToken: string | null; refreshToken: string | null }) => void;
  clear: () => void;
};

export const createStorage = (autologinEnabled: boolean): void => {
  let authPluginId: string | null = LOCAL_STORAGE_EXISTS
    ? localStorage.getItem(SALEOR_AUTH_PLUGIN_ID)
    : null;
  let accessToken: string | null = null;
  let refreshToken: string | null =
    autologinEnabled && LOCAL_STORAGE_EXISTS ? localStorage.getItem(SALEOR_REFRESH_TOKEN) : null;

  const setAuthPluginId = (pluginId: string | null): void => {
    if (LOCAL_STORAGE_EXISTS) {
      if (pluginId) {
        localStorage.setItem(SALEOR_AUTH_PLUGIN_ID, pluginId);
      } else {
        localStorage.removeItem(SALEOR_AUTH_PLUGIN_ID);
      }
    }

    authPluginId = pluginId;
  };

  const setRefreshToken = (token: string | null): void => {
    if (token) {
      localStorage.setItem(SALEOR_REFRESH_TOKEN, token);
    } else {
      localStorage.removeItem(SALEOR_REFRESH_TOKEN);
    }

    refreshToken = token;
  };

  const setAccessToken = (token: string | null): void => {
    accessToken = token;
  };

  const getAuthPluginId = (): string | null => authPluginId;
  const getAccessToken = (): string | null => accessToken;
  const getRefreshToken = (): string | null => refreshToken;

  const setTokens = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string | null;
    refreshToken: string | null;
  }): void => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const clear = (): void => {
    setAuthPluginId(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  storage = {
    setAuthPluginId,
    setAccessToken,
    setRefreshToken,
    getAuthPluginId,
    getAccessToken,
    getRefreshToken,
    setTokens,
    clear,
  };
};
