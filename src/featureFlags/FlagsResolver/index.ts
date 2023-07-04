import { useRef } from "react";

import * as AvailableFlags from "./../availableFlags";
import { AvailableStrategies } from "./../strategies";
import { DefaultsStrategy } from "./../strategies/DefaultsStrategy";
import { Strategy } from "./../Strategy";
import { reduceFlagListArray } from "./reduceFlagListArray";

export class FlagsResolver {
  private results: Promise<AvailableFlags.FlagList[]>;
  private readonly strategies: Strategy[];

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

    return reduceFlagListArray(list);
  }

  public getResult() {
    return this.results;
  }
}

export const useFlagsResolver = (strategies: AvailableStrategies[]) => {
  const resolver = useRef<FlagsResolver>(new FlagsResolver(strategies));

  return resolver.current;
};
