import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { z } from "zod";

const lastLoginMethodSchema = z
  .enum(["password", "mirumee.authentication.openidconnect", "cloud_auth.CloudAuthorizationPlugin"])
  .nullable();

export type LastLoginMethod = z.infer<typeof lastLoginMethodSchema>;

export const useLastLoginMethod = () => {
  const [localStorageValue, setLocalStorageValue] = useLocalStorage<LastLoginMethod | null>(
    "lastLoginMethod",
    null,
  );

  const handleSetLastLoginMethod = (method: string) => {
    const parsed = lastLoginMethodSchema.safeParse(method);

    if (parsed.success) {
      setLocalStorageValue(parsed.data);
    } else {
      // log to sentry
      setLocalStorageValue(null);
    }
  };

  return { lastLoginMethod: localStorageValue, setLastLoginMethod: handleSetLastLoginMethod };
};
