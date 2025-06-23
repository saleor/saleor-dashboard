import { FilterStrategyResolver } from "../API/strategies";
import { FilterElement } from "../FilterElement";

export enum QueryApiType {
  WHERE = "where",
  FILTER = "filter",
}

export interface SpecialHandler<T extends Record<string, any>> {
  canHandle(element: FilterElement): boolean;
  handle(result: T, element: FilterElement, resolver: FilterStrategyResolver): void;
}

export type StaticQueryPart = string | any | boolean | any;
