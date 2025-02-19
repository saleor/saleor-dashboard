import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialProductTypesState {
  typeOfProduct: ItemOption[];
  configurable: ItemOption[];
}

export class InitialProductTypesStateResponse implements InitialProductTypesState {
  constructor(
    public typeOfProduct: ItemOption[] = [],
    public configurable: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialProductTypesStateResponse();
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
      case "typeOfProduct":
        return this.typeOfProduct;
      case "configurable":
        return this.configurable;
      default:
        return [];
    }
  }
}
