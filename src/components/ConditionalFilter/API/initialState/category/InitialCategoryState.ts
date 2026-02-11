import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

interface InitialCategoryState {
  metadata: ItemOption[];
  updatedAt: ItemOption[];
}

export class InitialCategoryStateResponse implements InitialCategoryState {
  constructor(
    public metadata: ItemOption[] = [],
    public updatedAt: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialCategoryStateResponse();
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
      case "metadata":
        return this.metadata;
      case "updatedAt":
        return this.updatedAt;
      default:
        return [];
    }
  }
}
