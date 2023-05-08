import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export const useAuthParameters = () => {
  const [requestedExternalPluginId, setRequestedExternalPluginId] =
    useLocalStorage("requestedExternalPluginId", null);
  const [fallbackUri, setFallbackUri] = useLocalStorage(
    "externalLoginFallbackUri",
    null,
  );

  return {
    requestedExternalPluginId,
    fallbackUri: fallbackUri === "null" ? null : fallbackUri,
    setRequestedExternalPluginId,
    setFallbackUri,
  };
};
