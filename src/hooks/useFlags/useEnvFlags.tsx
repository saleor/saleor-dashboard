import { FlagsResults, FlagWithName } from "./types";

export const ENV_FLAG_PREFIX = "FF_";

export const useEnvFlags = <T extends readonly string[]>(
  flags: readonly [...T],
): FlagsResults<T> =>
  flags.reduce((acc, flag) => {
    const envFlag = process.env[prepareFlagName(flag)];

    if (envFlag) {
      acc[flag] = {
        enabled: envFlag !== "",
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

function prepareFlagName(flagName: string) {
  return `${ENV_FLAG_PREFIX}${flagName.toLocaleUpperCase()}`;
}

export const useAllEnvFlags = (): FlagWithName[] =>
  Object.entries(process.env)
    .filter(([envKey]) => envKey.startsWith(ENV_FLAG_PREFIX))
    .map(([flagKey, flagValue]) => ({
      name: flagKey,
      enabled: flagValue !== "",
      value: flagValue || "",
    }));
