import { FlagList } from "../availableFlags";
import { FlagContent } from "../FlagContent";
import { Strategy } from "../Strategy";

const byFlagPrefix = ([key, _]) => key.startsWith("FF");

const toFlagList = (p, [name, content]) => {
  p[name] = FlagContent.fromString(content);
  return p;
};

export class LocalStorageStrategy implements Strategy {
  fetchAll(): Promise<FlagList> {
    return Object.entries(localStorage)
      .filter(byFlagPrefix)
      .reduce(toFlagList, {});
  }
}
