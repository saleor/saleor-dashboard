import { ItemOption } from "../../../FilterElement/ConditionValue";
import { UrlToken } from "../../../ValueProvider/UrlToken";

export interface InitialAttributesState {
  channels: ItemOption[];
  attributeTypes: ItemOption[];
  filterableInStorefront: ItemOption[];
  isVariantOnly: ItemOption[];
  valueRequired: ItemOption[];
  visibleInStorefront: ItemOption[];
}

export class InitialAttributesStateResponse implements InitialAttributesState {
  constructor(
    public channels: ItemOption[] = [],
    public attributeTypes: ItemOption[] = [],
    public filterableInStorefront: ItemOption[] = [],
    public isVariantOnly: ItemOption[] = [],
    public valueRequired: ItemOption[] = [],
    public visibleInStorefront: ItemOption[] = [],
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
      case "filterableInStorefront":
        return this.filterableInStorefront;
      case "isVariantOnly":
        return this.isVariantOnly;
      case "valueRequired":
        return this.valueRequired;
      case "visibleInStorefront":
        return this.visibleInStorefront;
      default:
        return [];
    }
  }
}
