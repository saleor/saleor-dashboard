import { ObjectStorageStrategy } from "./ObjectStorageStrategy";

export class LocalStorageStrategy extends ObjectStorageStrategy {
  sourceObject = localStorage;
}
