import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export type LastLoginMethod = string | null;

export const useLastLoginMethod = () => {
  const [lastLoginMethod, setLastLoginMethod] = useLocalStorage<LastLoginMethod>(
    "lastLoginMethod",
    null,
  );

  return { lastLoginMethod, setLastLoginMethod };
};
