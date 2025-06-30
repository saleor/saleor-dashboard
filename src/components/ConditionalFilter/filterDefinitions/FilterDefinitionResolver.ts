import { FilterElement } from "../FilterElement";
import { AttributeDefinition } from "./definitions/AttributeDefinition";
import { AttributeTypeDefinition } from "./definitions/AttributeTypeDefinition";
import { CollectionChannelDefinition } from "./definitions/CollectionChannelDefinition";
import { CollectionPublishedDefinition } from "./definitions/CollectionPublishedDefinition";
import { CustomerNumberOfOrdersDefinition } from "./definitions/CustomerNumberOfOrdersDefinition";
import { DefaultDefinition } from "./definitions/DefaultDefinition";
import { GiftCardDefinition } from "./definitions/GiftCardDefinition";
import { MetadataDefinition } from "./definitions/MetadataDefinition";
import { ProductTypeConfigurableDefinition } from "./definitions/ProductTypeConfigurableDefinition";
import { StaffMemberStatusDefinition } from "./definitions/StaffMemberStatusDefinition";
import { StaticBooleanDefinition } from "./definitions/StaticBooleanDefinition";
import { StaticDefinition } from "./definitions/StaticDefinition";
import { VoucherChannelDefinition } from "./definitions/VoucherChannelDefinition";
import { VoucherStatusDefinition } from "./definitions/VoucherStatusDefinition";
import { VoucherTimesUsedDefinition } from "./definitions/VoucherTimesUsedDefinition";
import { FilterDefinition } from "./types";

export class FilterDefinitionResolver {
  private definitions: Array<FilterDefinition<any>>;

  private constructor(definitions: Array<FilterDefinition<any>>) {
    this.definitions = definitions;
  }

  public static getDefaultResolver() {
    // This is the place to register all available definitions.
    // The order is important, as the first matching definition will be used.
    // DefaultDefinition should be last as it handles any unmatched element.
    return new FilterDefinitionResolver([
      new AttributeDefinition(),
      new AttributeTypeDefinition(),
      new CollectionChannelDefinition(),
      new CollectionPublishedDefinition(),
      new CustomerNumberOfOrdersDefinition(),
      new GiftCardDefinition(),
      new MetadataDefinition(),
      new ProductTypeConfigurableDefinition(),
      new StaffMemberStatusDefinition(),
      new StaticBooleanDefinition(),
      new StaticDefinition(),
      new VoucherChannelDefinition(),
      new VoucherStatusDefinition(),
      new VoucherTimesUsedDefinition(),
      new DefaultDefinition(),
    ]);
  }

  public resolve(element: FilterElement): FilterDefinition<any> {
    const definition = this.definitions.find(def => def.canHandle(element));

    if (!definition) {
      throw new Error(`No definition found for filter element: "${element.value.value}"`);
    }

    return definition;
  }
}
