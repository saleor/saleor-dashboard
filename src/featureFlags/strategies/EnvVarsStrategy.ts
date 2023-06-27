import { ObjectStorageStrategy } from "./ObjectStorageStrategy";

export class EnvVarsStrategy extends ObjectStorageStrategy {
  sourceObject = FLAGS;
}
