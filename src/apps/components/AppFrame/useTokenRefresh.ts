import jwt_decode from "jwt-decode";
import { useEffect, useRef } from "react";

interface AppToken {
  exp?: number;
  iat?: number;
}

const TIME_BEFORE_REFRESH = 30 * 1000; // 30 seconds

const useTokenRefresh = (token?: string, refetch?: () => void) => {
  let decoded: AppToken;

  // For some reason jwt_decode causes seemingly unrelated error in tests
  // It seems like at some point undefined token is passed
  // Wrapping it in try..catch and if fixes the issue
  try {
    if (token) {
      decoded = jwt_decode(token) as AppToken;
    }
  } catch (e) {
    console.warn(e);
  }

  const decodedSuccesfully = !!decoded?.iat && !!decoded?.exp;

  const refreshTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);

  const tokenLife = (decoded?.exp - decoded?.iat) * 1000; // in ms
  const refreshTime = tokenLife - TIME_BEFORE_REFRESH;

  const setUpTimeout = () => {
    refetch();
    createTimeout();
  };

  const createTimeout = () => {
    refreshTimeout.current = setTimeout(setUpTimeout, refreshTime);
  };

  const deleteTimeout = () => {
    if (refreshTimeout?.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = null;
    }
  };

  useEffect(() => {
    if (refetch && decodedSuccesfully) {
      createTimeout();
    }

    return () => !!refetch && decodedSuccesfully && deleteTimeout();
  }, [token]);
};

export default useTokenRefresh;
