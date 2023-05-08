import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import { loginCallbackPath } from "../urls";
import { useAuthParameters } from "./useAuthParameters";

export const useAuthRedirection = () => {
  const paramName = "saleorPluginId";
  const router = useRouter();
  const params = new URLSearchParams(router.location.search);
  const shouldRedirect = params.has(paramName);
  const { authenticated, authenticating, requestLoginByExternalPlugin } =
    useUser();
  const { setRequestedExternalPluginId } = useAuthParameters();

  const handleAuthentication = async () => {
    const pluginId = params.get(paramName);

    setRequestedExternalPluginId(pluginId);

    const redirectUri = urlJoin(
      window.location.origin,
      getAppMountUriForRedirect(),
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
    handleAuthentication();
  }, []);

  return {
    authenticated,
    authenticating: authenticating || shouldRedirect,
  };
};
