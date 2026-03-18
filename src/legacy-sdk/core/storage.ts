import { LOCAL_STORAGE_EXISTS } from "../constants";
import { SALEOR_AUTH_PLUGIN_ID, SALEOR_REFRESH_TOKEN } from "./constants";

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
