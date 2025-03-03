import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const key = "login_date";

export const usePersistLoginDate = () => {
  const [lastLoginDate, setLastLoginDate] = useLocalStorage<string | null>(key, null);

  return {
    lastLoginDate,
    setLastLoginDate,
  };
};
