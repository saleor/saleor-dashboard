import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";

import { FlagsResults, FlagWithName } from "./types";

export const ENV_FLAG_PREFIX = "FF_";

export const useEnvFlags = <T extends readonly string[]>(
  flags: readonly [...T],
): FlagsResults<T> =>
  flags.reduce((acc, flag) => {
    const envFlag = process.env[flagNameToEnvName(flag)];

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

export const useAllEnvFlags = (): FlagWithName[] =>
  Object.entries(process.env)
    .filter(([envKey]) => envKey.startsWith(ENV_FLAG_PREFIX))
    .map(([flagKey, flagValue]) => ({
      name: envNameToFlagName(flagKey),
      enabled: flagValue !== "",
      value: flagValue || "",
    }));

function flagNameToEnvName(flagName: string) {
  return `${ENV_FLAG_PREFIX}${snakeCase(flagName).toUpperCase()}`;
}

function envNameToFlagName(envName: string) {
  const name = envName.split(ENV_FLAG_PREFIX)[1];
  return camelCase(name);
}
