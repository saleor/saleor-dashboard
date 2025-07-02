import { FilterElement } from "../FilterElement";
import {
  AttributeDefinition,
  AttributeTypeDefinition,
  CollectionPublishedDefinition,
  CustomerNumberOfOrdersDefinition,
  DefaultDefinition,
  MetadataDefinition,
  ProductTypeConfigurableDefinition,
  StaffMemberStatusDefinition,
  StaticBooleanDefinition,
  StaticDefinition,
  VoucherStatusDefinition,
  VoucherTimesUsedDefinition,
} from "./definitions";
import { FilterDefinition } from "./types";

export class FilterDefinitionResolver {
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
      new AttributeTypeDefinition(),
      new CollectionPublishedDefinition(),
      new CustomerNumberOfOrdersDefinition(),
      new MetadataDefinition(),
      new ProductTypeConfigurableDefinition(),
      new StaffMemberStatusDefinition(),
      new StaticBooleanDefinition(),
      new StaticDefinition(),
      new VoucherStatusDefinition(),
      new VoucherTimesUsedDefinition(),
      new DefaultDefinition(),
    ];
  }

  public static getDefaultResolver() {
    return new FilterDefinitionResolver(FilterDefinitionResolver.getDefaultDefinitions());
  }

  public resolve(element: FilterElement): FilterDefinition<any> {
    const definition = this.definitions.find(def => def.canHandle(element));

    if (!definition) {
      throw new Error(`No definition found for filter element: "${element.value.value}"`);
    }

    return definition;
  }
}
