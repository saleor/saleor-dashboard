import { Flag } from "./types";
import { useAllEnvFlags, useEnvFlag } from "./useEnvFlag";
import { useAllFlagsmishFlags, useFlagsmithFlag } from "./useFlagsmithFlag";

export const useFlag = (flags: string[]): Flag[] => {
  const envFlags = useEnvFlag(flags);
  const flagsmishFlags = useFlagsmithFlag(flags);

  // const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;
  const isFeatureFlagsEnabled = "true";

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};

export const useAllFlags = (): Flag[] => {
  const envFlags = useAllEnvFlags();
  const flagsmishFlags = useAllFlagsmishFlags();

  // const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;
  const isFeatureFlagsEnabled = "true";

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};
