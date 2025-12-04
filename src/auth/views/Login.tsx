import { useAvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { useEffect, useRef } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/types";
import { useAuthParameters } from "../hooks/useAuthParameters";
import { useLastLoginMethod } from "../hooks/useLastLoginMethod";
import { loginCallbackPath, LoginUrlQueryParams } from "../urls";

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

  // Determine if we should skip the query (when we're on callback path with auth params)
  const { code, state } = params;
  const isExternalAuthCallback = !!(code && state && isCallbackPath);

  const { data: externalAuthentications, loading: externalAuthenticationsLoading } =
    useAvailableExternalAuthenticationsQuery({
      skip: isExternalAuthCallback,
    });

  const { lastLoginMethod, setLastLoginMethod } = useLastLoginMethod();
  // Track if external auth callback has been processed to avoid double-processing in Strict Mode
  const externalAuthProcessedRef = useRef(false);

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
    const externalAuthNotPerformed = !authenticating && !errors.length;

    // Guard against double-processing in React Strict Mode
    if (isExternalAuthCallback && externalAuthNotPerformed && !externalAuthProcessedRef.current) {
      externalAuthProcessedRef.current = true;
      handleExternalAuthentication(code!, state!);
    }
    // Note: Cleanup removed - it was causing issues with React Strict Mode by clearing
    // localStorage during simulated unmount. The auth parameters are already cleared
    // in handleExternalAuthentication after successful login.
  }, [isExternalAuthCallback, authenticating, errors.length]);

  return (
    <LoginPage
      errors={errors}
      disabled={authenticating}
      externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
      loading={externalAuthenticationsLoading || authenticating}
      onExternalAuthentication={handleRequestExternalAuthentication}
      onSubmit={handleSubmit}
      lastLoginMethod={lastLoginMethod}
    />
  );
};

LoginView.displayName = "LoginView";
export default LoginView;
