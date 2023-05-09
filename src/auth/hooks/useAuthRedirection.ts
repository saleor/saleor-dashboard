import { APP_MOUNT_URI, APP_DEFAULT_URI } from "@saleor/config";
import { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import { loginCallbackPath } from "../urls";
import { useAuthParameters } from "./useAuthParameters";

const PLUGIN_ID_PARAM = "saleorPluginId";

export const useAuthRedirection = () => {
  const router = useRouter();
  const params = new URLSearchParams(router.location.search);
  const shouldRedirect = params.has(PLUGIN_ID_PARAM);
  const { authenticated, authenticating, requestLoginByExternalPlugin } =
    useUser();
  const { setRequestedExternalPluginId } = useAuthParameters();
  const pluginId = params.get(PLUGIN_ID_PARAM);

  const handleAuthentication = async () => {
    setRequestedExternalPluginId(pluginId);

    const redirectUri = urlJoin(
      window.location.origin,
      APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI,
      loginCallbackPath,
    );

    const response = await requestLoginByExternalPlugin(pluginId, {
      redirectUri,
    });
    const data = JSON.parse(response?.authenticationData || "");

    if (data && !response?.errors?.length) {
      window.location.href = data.authorizationUrl;
    }
  };

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    if (authenticated || authenticating) {
      window.location.href = APP_MOUNT_URI;
      return;
    }

    if (!authenticated && !authenticating) {
      handleAuthentication();
    }
  }, [shouldRedirect, authenticated, authenticating]);

  return {
    authenticated,
    authenticating: authenticating || shouldRedirect,
  };
};
