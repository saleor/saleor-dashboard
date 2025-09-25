import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const STORAGE_KEY = "emailUsedToLogin";

export const useStoreEmailUsedToLogin = () => {
  const [emailUsedToLogin, setEmailUsedToLogin] = useLocalStorage<string | null>(STORAGE_KEY, null);

  return {
    emailUsedToLogin,
    setEmailUsedToLogin,
  };
};
