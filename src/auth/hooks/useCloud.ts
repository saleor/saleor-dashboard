import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";

import { CLOUD_PLUGIN_ID } from "../utils";

const PLUGIN_KEY = "_saleorAuthPluginId";

export const useCloud = () => {
  const [pluginId] = useLocalStorage(PLUGIN_KEY, "");

  return {
    isCloudInstance: IS_CLOUD_INSTANCE,
    isAuthenticatedViaCloud: pluginId === CLOUD_PLUGIN_ID,
  };
};
