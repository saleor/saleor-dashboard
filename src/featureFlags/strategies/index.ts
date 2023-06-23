import { EnvVarsStrategy } from "./EnvVarsStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";

export { EnvVarsStrategy, LocalStorageStrategy };

export type AvailableStrategies =
  | typeof EnvVarsStrategy
  | typeof LocalStorageStrategy;
