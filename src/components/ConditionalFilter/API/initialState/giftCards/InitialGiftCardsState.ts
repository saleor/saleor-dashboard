import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialGiftCardsState {
  currency: ItemOption[];
  products: ItemOption[];
  isActive: ItemOption[];
  tags: ItemOption[];
  usedBy: ItemOption[];
}

export class InitialGiftCardsStateResponse implements InitialGiftCardsState {
  constructor(
    public currency: ItemOption[] = [],
    public products: ItemOption[] = [],
    public isActive: ItemOption[] = [],
    public tags: ItemOption[] = [],
    public usedBy: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialGiftCardsStateResponse();
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
      case "currency":
        return this.currency;
      case "products":
        return this.products;
      case "isActive":
        return this.isActive;
      case "tags":
        return this.tags;
      case "usedBy":
        return this.usedBy;
      default:
        return [];
    }
  }
}
