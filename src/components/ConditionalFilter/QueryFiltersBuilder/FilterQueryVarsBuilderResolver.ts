import { FilterElement } from "../FilterElement";
import {
  AttributeQueryVarsBuilder,
  DefaultQueryVarsBuilder,
  ProductTypeQueryVarsBuilder,
  StaticBooleanQueryVarsBuilder,
  StaticQueryVarsBuilder,
} from "./queryVarsBuilders";
import { FilterQuery, QueryVarsBuilder } from "./queryVarsBuilders/types";

export class FilterQueryVarsBuilderResolver<TQuery extends FilterQuery> {
  private queryVarsBuilders: Array<QueryVarsBuilder<TQuery>>;

  constructor(availableQueryVarsBuilders: Array<QueryVarsBuilder<TQuery>>) {
    this.queryVarsBuilders = availableQueryVarsBuilders;
  }

  /**
   * This is a place to register all available definitions.
   * Returns the default set of filter definitions in the correct order.
   * The order is important, as the first matching definition will be used.
   * DefaultDefinition should be last as it handles any unmatched element.
   *
   * We use `any` because we don't know the exact type of TQuery at this point (static method).
   * Also QueryVarsBuilders support support each different queries APIs based on canHandle method,
   * so decision on which precisely QueryVarsBuilders to use is made in declaration for each page in Dashboard.
   * These should work with any filter / where input type, and can be overridden if needed.
   */
  public static getDefaultQueryVarsBuilders(): Array<QueryVarsBuilder<any>> {
    return [
      new AttributeQueryVarsBuilder(),
      new ProductTypeQueryVarsBuilder(),
      new StaticBooleanQueryVarsBuilder(),
      new StaticQueryVarsBuilder(),
      new DefaultQueryVarsBuilder(),
    ];
  }

  public static getDefaultResolver() {
    return new FilterQueryVarsBuilderResolver(
      FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
    );
  }

  public resolve(element: FilterElement): QueryVarsBuilder<TQuery> {
    const definition = this.queryVarsBuilders.find(def => def.canHandle(element));

    if (!definition) {
      throw new Error(`No definition found for filter element: "${element.value.value}"`);
    }

    return definition;
  }
}
