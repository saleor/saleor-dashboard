import { useRef } from "react";

import { FlagList } from "./availableFlags";
import { FlagContent } from "./FlagContent";
import { AvailableStrategies } from "./strategies";
import { DefaultsStrategy } from "./strategies/DefaultsStrategy";
import { Strategy } from "./Strategy";

const byNotEmpty = (p: FlagList) => Object.keys(p).length > 0;

const toFlagEntries = (
  p: Array<[string, FlagContent]>,
  c: FlagList,
): Array<[string, FlagContent]> => [...p, ...Object.entries(c)];

const toWithoutPrefixes = ([name, content]) => [
  name.replace("FF_", ""),
  content,
];

const toSingleObject = (p: FlagList, [name, content]) => {
  if (!p[name]) {
    p[name] = content;
  }

  return p;
};

export class FlagsResolver {
  private results: Promise<FlagList[]>;
  private strategies: Strategy[];

  constructor(strategies: Strategy[]) {
    this.strategies = [...strategies, new DefaultsStrategy()];
  }

  public fetchAll() {
    const promises = this.strategies.map(s => s.fetchAll());
    this.results = Promise.all(promises);

    return this;
  }

  public async combineWithPriorities(): Promise<FlagList> {
    const list = await this.results;

    return list
      .filter(byNotEmpty)
      .reduce(toFlagEntries, [])
      .map(toWithoutPrefixes)
      .reduce(toSingleObject, {} as FlagList);
  }

  public getResult() {
    return this.results;
  }
}

const createInstances = (strategies: AvailableStrategies[]) =>
  strategies.map(Constrctor => new Constrctor());

export const useFlagsResolver = (strategies: AvailableStrategies[]) => {
  const resolver = useRef<FlagsResolver>(null);

  if (!resolver.current) {
    resolver.current = new FlagsResolver(createInstances(strategies));
  }

  return resolver.current;
};
