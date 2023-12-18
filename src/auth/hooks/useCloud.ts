import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const CLOUD_PLUGIN_ID = "cloud_auth.CloudAuthorizationPlugin";
const PLUGIN_KEY = "_saleorAuthPluginId";

export const useCloud = () => {
  const [pluginId] = useLocalStorage(PLUGIN_KEY, "");

  return {
    isCloudInstance: IS_CLOUD_INSTANCE,
    isAuthenticatedViaCloud: pluginId === CLOUD_PLUGIN_ID,
  };
};
