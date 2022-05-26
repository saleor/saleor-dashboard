import { APP_DEFAULT_URI, APP_MOUNT_URI } from "@saleor/config";
import { useAvailableExternalAuthenticationsQuery } from "@saleor/graphql";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import React, { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/types";
import { loginCallbackPath, LoginUrlQueryParams } from "../urls";

interface LoginViewProps {
  params: LoginUrlQueryParams;
}

const LoginView: React.FC<LoginViewProps> = ({ params }) => {
  const navigate = useNavigator();
  const { location } = useRouter();
  const {
    login,
    requestLoginByExternalPlugin,
    loginByExternalPlugin,
    authenticating,
    error,
  } = useUser();
  const {
    data: externalAuthentications,
    loading: externalAuthenticationsLoading,
  } = useAvailableExternalAuthenticationsQuery();
  const [
    requestedExternalPluginId,
    setRequestedExternalPluginId,
  ] = useLocalStorage("requestedExternalPluginId", null);

  const [fallbackUri, setFallbackUri] = useLocalStorage(
    "externalLoginFallbackUri",
    null,
  );

  const handleSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    const errors = result?.errors || [];

    return errors;
  };

  const handleRequestExternalAuthentication = async (pluginId: string) => {
    setFallbackUri(location.pathname);

    const result = await requestLoginByExternalPlugin(pluginId, {
      redirectUri: urlJoin(
        window.location.origin,
        APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI,
        loginCallbackPath,
      ),
    });
    const data = JSON.parse(result?.authenticationData || "");
    if (data && !result?.errors?.length) {
      setRequestedExternalPluginId(pluginId);
      window.location.href = data.authorizationUrl;
    }
  };

  const handleExternalAuthentication = async (code: string, state: string) => {
    const result = await loginByExternalPlugin(requestedExternalPluginId, {
      code,
      state,
    });
    setRequestedExternalPluginId(null);
    if (result && !result?.errors?.length) {
      navigate(fallbackUri ?? "/");
      setFallbackUri(null);
    }
  };

  useEffect(() => {
    const { code, state } = params;
    const isCallbackPath = location.pathname.includes(loginCallbackPath);

    if (code && state && isCallbackPath) {
      handleExternalAuthentication(code, state);
    }
  }, []);

  return (
    <LoginPage
      error={error}
      disabled={authenticating}
      externalAuthentications={
        externalAuthentications?.shop?.availableExternalAuthentications
      }
      loading={externalAuthenticationsLoading || authenticating}
      onExternalAuthentication={handleRequestExternalAuthentication}
      onSubmit={handleSubmit}
    />
  );
};
LoginView.displayName = "LoginView";
export default LoginView;
