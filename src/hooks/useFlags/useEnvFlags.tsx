import { FlagsResults } from "./types";

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
  return `FF_${flagName.toLocaleUpperCase()}`;
}
