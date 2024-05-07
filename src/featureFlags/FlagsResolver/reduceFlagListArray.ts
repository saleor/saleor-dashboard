import * as AvailableFlags from "./../availableFlags";
import { FlagValue } from "./../FlagContent";

const byNotEmpty = (p: AvailableFlags.GeneralFlagList) => Object.keys(p).length > 0;
const toFlagEntries = (
  p: Array<[string, FlagValue]>,
  c: AvailableFlags.GeneralFlagList,
): Array<[string, FlagValue]> => [...p, ...Object.entries(c)];
const toWithoutPrefixes = ([name, value]: [string, FlagValue]): [string, FlagValue] => [
  name.replace("FF_", ""),
  value,
];
const toSingleObject = (p: AvailableFlags.GeneralFlagList, [name, value]: [string, FlagValue]) => {
  if (!AvailableFlags.isSupported(name)) {
    return p;
  }

  if (!p[name]) {
    p[name] = value;
  }

  return p;
};

export const reduceFlagListArray = (flagListArray: AvailableFlags.FlagList[]) =>
  flagListArray
    .filter(byNotEmpty)
    .reduce(toFlagEntries, [])
    .map(toWithoutPrefixes)
    .reduce(toSingleObject, {} as AvailableFlags.FlagList);
