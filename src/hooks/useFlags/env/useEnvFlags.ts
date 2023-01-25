import { FlagsResults } from "../types";
import { flagNameToEnvName, isFlagEnabled, readFlagFromEnv } from "./helpers";

export const useEnvFlags = <T extends readonly string[]>(
  flags: readonly [...T],
): FlagsResults<T> =>
  flags.reduce((acc, flag) => {
    const envFlag = readFlagFromEnv(flagNameToEnvName(flag));

    if (envFlag) {
      acc[flag] = {
        enabled: isFlagEnabled(envFlag),
        value: envFlag,
      };
    } else {
      acc[flag] = {
        enabled: false,
        value: "",
      };
    }

    return acc;
  }, {} as FlagsResults<T>);
