import { useRef } from "react";

import * as AvailableFlags from "./availableFlags";
import { FlagValue } from "./FlagContent";
import { AvailableStrategies } from "./strategies";
import { DefaultsStrategy } from "./strategies/DefaultsStrategy";
import { Strategy } from "./Strategy";

const byNotEmpty = (p: AvailableFlags.GeneralFlagList) =>
  Object.keys(p).length > 0;

const toFlagEntries = (
  p: Array<[string, FlagValue]>,
  c: AvailableFlags.GeneralFlagList,
): Array<[string, FlagValue]> => [...p, ...Object.entries(c)];

const toWithoutPrefixes = ([name, value]: [string, FlagValue]): [
  string,
  FlagValue,
] => [name.replace("FF_", ""), value];

const toSingleObject = (
  p: AvailableFlags.GeneralFlagList,
  [name, value]: [string, FlagValue],
) => {
  if (!AvailableFlags.isSupported(name)) {
    return p;
  }

  if (!p[name]) {
    p[name] = value;
  }

  return p;
};

export class FlagsResolver {
  private results: Promise<AvailableFlags.FlagList[]>;
  private strategies: Strategy[];

  constructor(
    strategies: Strategy[],
    defaultStrategy = new DefaultsStrategy(),
  ) {
    this.results = Promise.resolve([]);
    this.strategies = [...strategies, defaultStrategy];
  }

  public fetchAll() {
    const promises = this.strategies.map(s => s.fetchAll());
    this.results = Promise.all(promises);

    return this;
  }

  public async combineWithPriorities(): Promise<AvailableFlags.FlagList> {
    const list = await this.results;

    return list
      .filter(byNotEmpty)
      .reduce(toFlagEntries, [])
      .map(toWithoutPrefixes)
      .reduce(toSingleObject, {} as AvailableFlags.FlagList);
  }

  public getResult() {
    return this.results;
  }
}

export const useFlagsResolver = (strategies: AvailableStrategies[]) => {
  const resolver = useRef<FlagsResolver>(new FlagsResolver(strategies));

  return resolver.current;
};
