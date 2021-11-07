import { APP_DEFAULT_URI, APP_MOUNT_URI } from "@saleor/config";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useAuth } from "../AuthProvider";
import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/form";
import { availableExternalAuthentications } from "../queries";
import { AvailableExternalAuthentications } from "../types/AvailableExternalAuthentications";
import {
  loginCallbackPath,
  LoginUrlQueryParams,
  passwordResetUrl
} from "../urls";

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
    authenticating
  } = useAuth();
  const [isError, setIsError] = useState(false);
  const [isExternalError, setIsExternalError] = useState(false);
  const {
    data: externalAuthentications,
    loading: externalAuthenticationsLoading
  } = useQuery<AvailableExternalAuthentications>(
    availableExternalAuthentications
  );
  const [
    requestedExternalPluginId,
    setRequestedExternalPluginId
  ] = useLocalStorage("requestedExternalPluginId", null);

  const handleSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    const errors = result?.errors || [];

    setIsExternalError(false);
    setIsError(!result || errors?.length > 0);
    return errors;
  };

  const handleRequestExternalAuthentication = async (pluginId: string) => {
    const result = await requestLoginByExternalPlugin(pluginId, {
      redirectUri: urlJoin(
        window.location.origin,
        APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI,
        loginCallbackPath
      )
    });
    const errors = result?.errors || [];
    const data = JSON.parse(result?.authenticationData || "");
    setIsError(false);
    if (!data || errors?.length > 0) {
      setIsExternalError(true);
    } else {
      setRequestedExternalPluginId(pluginId);
      window.location.href = data.authorizationUrl;
    }
  };

  const handleExternalAuthentication = async (code: string, state: string) => {
    const result = await loginByExternalPlugin(requestedExternalPluginId, {
      code,
      state
    });
    const errors = result?.errors || [];
    setIsError(false);
    if (!result || errors?.length > 0) {
      setIsExternalError(true);
    } else {
      navigate(APP_DEFAULT_URI);
    }
    return errors;
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
      error={isError}
      externalError={isExternalError}
      disabled={authenticating}
      externalAuthentications={
        externalAuthentications?.shop?.availableExternalAuthentications
      }
      loading={externalAuthenticationsLoading || authenticating}
      onExternalAuthentication={handleRequestExternalAuthentication}
      onPasswordRecovery={() => navigate(passwordResetUrl)}
      onSubmit={handleSubmit}
    />
  );
};
LoginView.displayName = "LoginView";
export default LoginView;
