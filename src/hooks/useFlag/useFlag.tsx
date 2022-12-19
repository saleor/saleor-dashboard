import { Flag } from "./types";
import { useEnvFlag } from "./useEnvFlag";
import { useFlagsmithFlag } from "./useFlagsmithFlag";

export const useFlag = (flags: string[]): Flag[] => {
  const envFlags = useEnvFlag(flags);
  const flagsmishFlags = useFlagsmithFlag(flags);

  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};
