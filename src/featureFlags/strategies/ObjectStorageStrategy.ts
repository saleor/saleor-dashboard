import { FlagList, GeneralFlagList } from "../availableFlags";
import { FlagValue } from "../FlagContent";
import { Strategy } from "../Strategy";
import * as AvailableFlags from "./../availableFlags";

const byFlagPrefix = ([key, _]: [string, string]) => key.startsWith("FF");
const toFlagList = (p: GeneralFlagList, [name, value]: [string, string]) => {
  if (AvailableFlags.isSupported(name)) {
    p[name] = FlagValue.fromString(value);
  }

  return p;
};

export abstract class ObjectStorageStrategy implements Strategy {
  sourceObject: Record<string, string> = {};

  fetchAll(): Promise<FlagList> {
    const result = Object.entries(this.sourceObject)
      .filter(byFlagPrefix)
      .reduce(toFlagList, {} as FlagList);

    return Promise.resolve(result);
  }
}
