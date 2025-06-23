import { FilterElement } from "../../FilterElement";
import { AttributeBooleanStrategy } from "./AttributeBooleanStrategy";
import { ReferenceAttributeStrategy } from "./ReferenceAttributeStrategy";
import {
  CategoryStrategy,
  ChannelStrategy,
  CollectionStrategy,
  GenericStaticStrategy,
  ProductTypeStrategy,
} from "./SimpleFilterStrategies";
import { StandardAttributeStrategy } from "./StandardAttributeStrategy";
import { StaticBooleanStrategy } from "./StaticBooleanStrategy";
import { FilterHandlerStrategy } from "./types";

export class FilterStrategyResolver {
  private strategies: FilterHandlerStrategy[];

  private constructor(strategies: FilterHandlerStrategy[]) {
    this.strategies = strategies;
  }

  /** Resolver with standard resolution for filter strategies */
  static getResolver() {
    return new FilterStrategyResolver([
      new AttributeBooleanStrategy(),
      new ReferenceAttributeStrategy(),
      new StandardAttributeStrategy(),
      new StaticBooleanStrategy(),
      new CollectionStrategy(),
      new CategoryStrategy(),
      new ProductTypeStrategy(),
      new ChannelStrategy(),
      new GenericStaticStrategy(),
    ]);
  }

  resolve(filterElement: FilterElement): FilterHandlerStrategy {
    const strategy = this.strategies.find(s => s.canHandle(filterElement));

    if (!strategy) {
      throw new Error(`No strategy found for filter element: "${filterElement.rowType()}"`);
    }

    return strategy;
  }
}
