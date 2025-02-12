import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialAttributeState {
  channels: ItemOption[];
  attributeTypes: ItemOption[];
}

export class InitialAttributeStateResponse implements InitialAttributeState {
  constructor(
    public channels: ItemOption[] = [],
    public attributeTypes: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialAttributeStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "channel":
        return this.channels;
      case "attributeType":
        return this.attributeTypes;
      default:
        return [];
    }
  }
}
