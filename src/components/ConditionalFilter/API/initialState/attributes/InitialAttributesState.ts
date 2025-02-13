import { ItemOption } from "../../../FilterElement/ConditionValue";
import { UrlToken } from "../../../ValueProvider/UrlToken";

export interface InitialAttributesState {
  channels: ItemOption[];
  attributeTypes: ItemOption[];
}

export class InitialAttributesStateResponse implements InitialAttributesState {
  constructor(
    public channels: ItemOption[] = [],
    public attributeTypes: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialAttributesStateResponse();
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
