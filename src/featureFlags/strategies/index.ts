import { EnvVarsStrategy } from "./EnvVarsStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { type MetadataStrategy } from "./MetadataStrategy";

export { EnvVarsStrategy, LocalStorageStrategy };

export type AvailableStrategies = EnvVarsStrategy | LocalStorageStrategy | MetadataStrategy;
