import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialCollectionState {
  channel: ItemOption[];
}

export class InitialCollectionStateResponse implements InitialCollectionState {
  constructor(public channel: ItemOption[] = []) {}

  static empty() {
    return new InitialCollectionStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    const entry = this.getEntryByName(token.name);

    return entry.filter(item => item.value === token.value);
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "channel":
        return this.channel;
      default:
        return [];
    }
  }
}
