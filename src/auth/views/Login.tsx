import {
  PasswordLoginModeEnum,
  useAvailableExternalAuthenticationsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { useEffect } from "react";
import { useLocation } from "react-router";
import urlJoin from "url-join";

import LoginPage from "../components/LoginPage/LoginPage";
import { type LoginFormData } from "../components/LoginPage/types";
import { useAuthParameters } from "../hooks/useAuthParameters";
import { useLastLoginMethod } from "../hooks/useLastLoginMethod";
import { loginCallbackPath, type LoginUrlQueryParams } from "../urls";
import { useUser } from "../useUser";

interface LoginViewProps {
  params: LoginUrlQueryParams;
}

/**
 * The OAuth authorization `code` is single-use, but this view is mounted more than once per
 * callback: React 18 StrictMode double-invokes the mount effect in dev, and flipping
 * `authenticating` swaps the whole tree to `<LoginLoading />` and back, remounting it again.
 * Two concurrent `externalObtainAccessTokens` calls race on the same code — the loser comes back
 * with no user, which sets `noPermissionsError` and logs out, and that error then permanently
 * blocks `authenticated` even after the winner succeeds.
 *
 * Module scope, not a ref: a ref dies with the unmount this is meant to survive.
 */
let exchangedAuthCode: string | null = null;

const LoginView = ({ params }: LoginViewProps) => {
  const navigate = useNavigator();
  const location = useLocation();
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

    if (externalAuthParamsExist && externalAuthNotPerformed && exchangedAuthCode !== code) {
      exchangedAuthCode = code;
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
