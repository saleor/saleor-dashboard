import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialPageState {
  pageTypes: ItemOption[];
}

export class InitialPageStateResponse implements InitialPageState {
  constructor(public pageTypes: ItemOption[] = []) {}

  public static empty() {
    return new InitialPageStateResponse();
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
      case "pageTypes":
        return this.pageTypes;
      default:
        return [];
    }
  }
}
