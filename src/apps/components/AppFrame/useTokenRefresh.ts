import jwt_decode from "jwt-decode";
import { useEffect, useRef } from "react";

interface AppToken {
  exp: number;
  iat: number;
}

const TIME_BEFORE_REFRESH = 30 * 1000; // 30 seconds

const useTokenRefresh = (token: string, refetch?: () => void) => {
  const decoded = jwt_decode(token) as AppToken;
  const refreshTimeout = useRef<null | any>(null);

  const tokenLife = (decoded.exp - decoded.iat) * 1000; // in ms
  const refreshTime = tokenLife - TIME_BEFORE_REFRESH;

  const timeoutFunc = () => {
    refetch();
  };

  const setUpTimeout = () => {
    timeoutFunc();
    createTimeout();
  };

  const createTimeout = () => {
    refreshTimeout.current = setTimeout(setUpTimeout, refreshTime);
  };

  const deleteTimeout = () => {
    if (refreshTimeout?.current) {
      clearTimeout(refreshTimeout.current);
    }
  };

  useEffect(() => {
    createTimeout();

    return () => deleteTimeout();
  }, [token]);
};

export default useTokenRefresh;
