import { FlagList } from "../availableFlags";
import { FlagContent } from "../FlagContent";
import { Strategy } from "../Strategy";
import * as AvailableFlags from "./../availableFlags";

const byFlagPrefix = ([key, _]: [string, string]) => key.startsWith("FF");

const toFlagList = (p: FlagList, [name, content]: [string, string]) => {
  if (AvailableFlags.isSupported(name)) {
    p[name] = FlagContent.fromString(content);
  }

  return p;
};

export class EnvVarsStrategy implements Strategy {
  fetchAll(): Promise<FlagList> {
    const result = Object.entries(FLAGS)
      .filter(byFlagPrefix)
      .reduce(toFlagList, {} as FlagList);

    return Promise.resolve(result);
  }
}
