import {
  PasswordLoginModeEnum,
  useAvailableExternalAuthenticationsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import LoginPage from "../components/LoginPage";
import { type LoginFormData } from "../components/LoginPage/types";
import { useAuthParameters } from "../hooks/useAuthParameters";
import { useLastLoginMethod } from "../hooks/useLastLoginMethod";
import { loginCallbackPath, type LoginUrlQueryParams } from "../urls";
import { useUser } from "../useUser";

interface LoginViewProps {
  params: LoginUrlQueryParams;
}

const LoginView = ({ params }: LoginViewProps) => {
  const navigate = useNavigator();
  const { location } = useRouter();
  const { login, requestLoginByExternalPlugin, loginByExternalPlugin, authenticating, errors } =
    useUser();
  const {
    fallbackUri,
    requestedExternalPluginId,
    isCallbackPath,
    setFallbackUri,
    setRequestedExternalPluginId,
  } = useAuthParameters();

  const isCallbackFlow = !!(params.code && params.state && isCallbackPath);

  const { data: externalAuthentications, loading: externalAuthenticationsLoading } =
    useAvailableExternalAuthenticationsQuery({
      skip: isCallbackFlow,
      fetchPolicy: "network-only",
    });

  const { lastLoginMethod, setLastLoginMethod } = useLastLoginMethod();

  const handleSubmit = async (data: LoginFormData) => {
    if (!login) {
      return;
    }

    const result = await login(data.email, data.password);
    const errors = result?.errors || [];

    if (errors.length === 0) {
      setLastLoginMethod("password");
    }

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
    const externalAuthNotPerformed = !authenticating && !errors.length;

    if (externalAuthParamsExist && externalAuthNotPerformed) {
      handleExternalAuthentication(code, state);
    }

    return () => {
      setRequestedExternalPluginId(null);
      setFallbackUri(null);
    };
  }, []);

  const passwordLoginMode = externalAuthentications?.shop?.passwordLoginMode;
  const passwordLoginEnabled = passwordLoginMode === PasswordLoginModeEnum.ENABLED;

  return (
    <LoginPage
      errors={errors}
      disabled={authenticating}
      externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
      passwordLoginEnabled={passwordLoginEnabled}
      loading={externalAuthenticationsLoading || authenticating}
      onExternalAuthentication={handleRequestExternalAuthentication}
      onSubmit={handleSubmit}
      lastLoginMethod={lastLoginMethod}
    />
  );
};

LoginView.displayName = "LoginView";
export default LoginView;
