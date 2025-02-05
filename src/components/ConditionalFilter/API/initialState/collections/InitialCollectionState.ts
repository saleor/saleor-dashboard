import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialCollectionState {
  channel: ItemOption[];
}

export class InitialCollectionStateResponse implements InitialCollectionState {
  constructor(
    public channel: ItemOption[] = [],
    // public published: ItemOption[] = [],
    // public ids: ItemOption[] = [],
    // public metadata: ItemOption[] = [],
    // public slugs: ItemOption[] = [],
  ) {}

  static empty() {
    return new InitialCollectionStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return entry.filter(({ slug }) => slug === token.value);
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "channel":
        return this.channel;
      // case "published":
      //   return this.published;
      // case "ids":
      //   return this.ids;
      // case "metadata":
      //   return this.metadata;
      // case "slugs":
      //   return this.slugs;
      default:
        return [];
    }
  }
}
