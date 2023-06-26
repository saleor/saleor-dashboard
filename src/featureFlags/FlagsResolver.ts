import { useRef } from "react";

import * as AvailableFlags from "./availableFlags";
import { FlagContent } from "./FlagContent";
import { AvailableStrategies } from "./strategies";
import { DefaultsStrategy } from "./strategies/DefaultsStrategy";
import { Strategy } from "./Strategy";

const byNotEmpty = (p: AvailableFlags.FlagList) => Object.keys(p).length > 0;

const toFlagEntries = (
  p: Array<[string, FlagContent]>,
  c: AvailableFlags.FlagList,
): Array<[string, FlagContent]> => [...p, ...Object.entries(c)];

const toWithoutPrefixes = ([name, content]: [string, FlagContent]): [
  string,
  FlagContent,
] => [name.replace("FF_", ""), content];

const toSingleObject = (
  p: AvailableFlags.FlagList,
  [name, content]: [string, FlagContent],
) => {
  if (!AvailableFlags.isSupported(name)) {
    return p;
  }

  if (!p[name]) {
    p[name] = content;
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

const createInstances = (strategies: AvailableStrategies[]) =>
  strategies.map(Constrctor => new Constrctor());

export const useFlagsResolver = (strategies: AvailableStrategies[]) => {
  const resolver = useRef<FlagsResolver>(
    new FlagsResolver(createInstances(strategies)),
  );

  return resolver.current;
};
