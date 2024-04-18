import { EnvVarsStrategy } from "./EnvVarsStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { MetadataStrategy } from "./MetadataStrategy";

export { EnvVarsStrategy, LocalStorageStrategy, MetadataStrategy };

export type AvailableStrategies = EnvVarsStrategy | LocalStorageStrategy | MetadataStrategy;
