import useLocalStorage from "@dashboard/hooks/useLocalStorage";

import { loginCallbackPath } from "../urls";

export const useAuthParameters = () => {
  const [requestedExternalPluginId, setRequestedExternalPluginId] = useLocalStorage<string | null>(
    "requestedExternalPluginId",
    null,
  );
  const [fallbackUri, setFallbackUri] = useLocalStorage<string | null>(
    "externalLoginFallbackUri",
    null,
  );

  return {
    requestedExternalPluginId:
      requestedExternalPluginId === "null" ? null : requestedExternalPluginId,
    fallbackUri: fallbackUri === "null" || !fallbackUri ? "/" : fallbackUri,
    isCallbackPath: location.pathname.includes(loginCallbackPath),
    setRequestedExternalPluginId,
    setFallbackUri,
  };
};
