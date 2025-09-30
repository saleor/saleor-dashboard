import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export type LastLoginMethod = string | null;

const LAST_LOGIN_METHOD_KEY = "lastLoginMethod";

export const useLastLoginMethod = () => {
  const [lastLoginMethod, setLastLoginMethod] = useLocalStorage<LastLoginMethod>(
    LAST_LOGIN_METHOD_KEY,
    null,
  );

  return {
    lastLoginMethod,
    setLastLoginMethod,
    hasUserLoggedViaExternalMethod: lastLoginMethod !== null && lastLoginMethod !== "password",
  };
};
