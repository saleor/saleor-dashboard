import { FilterElement } from "../../FilterElement";
import {
  AttributeDefinition,
  DefaultQueryVarsBuilder,
  ProductTypeQueryVarsBuilder,
  StaticBooleanQueryVarsBuilder,
  StaticQueryVarsBuilder,
} from "./definitions";
import { FilterDefinition } from "./types";

export class FilterQueryVarsBuilderResolver {
  private definitions: Array<FilterDefinition<any>>;

  constructor(definitions: Array<FilterDefinition<any>>) {
    this.definitions = definitions;
  }

  /**
   * This is a place to register all available definitions.
   * Returns the default set of filter definitions in the correct order.
   * The order is important, as the first matching definition will be used.
   * DefaultDefinition should be last as it handles any unmatched element.
   */
  public static getDefaultDefinitions(): Array<FilterDefinition<any>> {
    return [
      new AttributeDefinition(),
      new ProductTypeQueryVarsBuilder(),
      new StaticBooleanQueryVarsBuilder(),
      new StaticQueryVarsBuilder(),
      new DefaultQueryVarsBuilder(),
    ];
  }

  public static getDefaultResolver() {
    return new FilterQueryVarsBuilderResolver(
      FilterQueryVarsBuilderResolver.getDefaultDefinitions(),
    );
  }

  public resolve(element: FilterElement): FilterDefinition<any> {
    const definition = this.definitions.find(def => def.canHandle(element));

    if (!definition) {
      throw new Error(`No definition found for filter element: "${element.value.value}"`);
    }

    return definition;
  }
}
