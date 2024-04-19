import { useAvailableExternalAuthenticationsLazyQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import React, { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/types";
import { useAuthParameters } from "../hooks/useAuthParameters";
import { loginCallbackPath, LoginUrlQueryParams } from "../urls";

interface LoginViewProps {
  params: LoginUrlQueryParams;
}

const LoginView: React.FC<LoginViewProps> = ({ params }) => {
  const navigate = useNavigator();
  const { location } = useRouter();
  const { login, requestLoginByExternalPlugin, loginByExternalPlugin, authenticating, errors } =
    useUser();
  const [
    queryExternalAuthentications,
    { data: externalAuthentications, loading: externalAuthenticationsLoading },
  ] = useAvailableExternalAuthenticationsLazyQuery();
  const {
    fallbackUri,
    requestedExternalPluginId,
    isCallbackPath,
    setFallbackUri,
    setRequestedExternalPluginId,
  } = useAuthParameters();
  const handleSubmit = async (data: LoginFormData) => {
    const result = await login!(data.email, data.password);
    const errors = result?.errors || [];

    return errors;
  };
  const handleRequestExternalAuthentication = async (pluginId: string) => {
    setFallbackUri(location.pathname);

    const result = await requestLoginByExternalPlugin!(pluginId, {
      redirectUri: urlJoin(window.location.origin, getAppMountUriForRedirect(), loginCallbackPath),
    });
    const data = JSON.parse(result?.authenticationData || "");

    if (data && !result?.errors?.length) {
      setRequestedExternalPluginId(pluginId);
      window.location.href = data.authorizationUrl;
    }
  };
  const handleExternalAuthentication = async (code: string, state: string) => {
    await loginByExternalPlugin!(requestedExternalPluginId, {
      code,
      state,
    });
    setRequestedExternalPluginId(null);
    navigate(fallbackUri);
    setFallbackUri(null);
  };

  useEffect(() => {
    const { code, state } = params;
    const externalAuthParamsExist = code && state && isCallbackPath;

    if (!externalAuthParamsExist) {
      queryExternalAuthentications();
    }
  }, [isCallbackPath, params, queryExternalAuthentications]);
  useEffect(() => {
    const { code, state } = params;
    const externalAuthParamsExist = code && state && isCallbackPath;
    const externalAuthNotPerformed = !authenticating && !errors.length;

    if (externalAuthParamsExist && externalAuthNotPerformed) {
      handleExternalAuthentication(code, state);
    }

    return () => {
      setRequestedExternalPluginId(null);
      setFallbackUri(null);
    };
  }, []);

  return (
    <LoginPage
      errors={errors}
      disabled={authenticating}
      externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
      loading={externalAuthenticationsLoading || authenticating}
      onExternalAuthentication={handleRequestExternalAuthentication}
      onSubmit={handleSubmit}
    />
  );
};

LoginView.displayName = "LoginView";
export default LoginView;
