import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";

import { ENV_FLAG_PREFIX } from "./const";

export const envNameToFlagName = (envName: string) => {
  const name = envName.split(ENV_FLAG_PREFIX)[1];
  return camelCase(name);
};

export const flagNameToEnvName = (flagName: string) =>
  `${ENV_FLAG_PREFIX}${snakeCase(flagName).toUpperCase()}`;

/**
 Referencing an virtual constant FLAGS, prepared by Vite. It populates env-based feature flags into client-side, under the virtual property FLAGS,
 Please do not use FLAGS constant directly anywhere.
*/
export const readFlagFromEnv = (flagName: string): string | undefined =>
  FLAGS[flagName];

export const readAllFlagsFromEnv = (): Record<string, string> => FLAGS;
