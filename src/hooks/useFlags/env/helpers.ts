import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";

import { ENV_FLAG_PREFIX } from "./const";

export const envNameToFlagName = (envName: string) => {
  const name = envName.split(ENV_FLAG_PREFIX)[1];
  return camelCase(name);
};

export const flagNameToEnvName = (flagName: string) =>
  `${ENV_FLAG_PREFIX}${snakeCase(flagName).toUpperCase()}`;
