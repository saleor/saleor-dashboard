import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialCollectionState {
  channel: ItemOption[];
  published: ItemOption[];
  metadata: ItemOption[];
}

export class InitialCollectionStateResponse implements InitialCollectionState {
  constructor(
    public channel: ItemOption[] = [],
    public published: ItemOption[] = [],
    public metadata: ItemOption[] = [],
  ) {}

  static empty() {
    return new InitialCollectionStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    // Special handling for metadata fields - preserve tuple structure
    // Metadata fields use text.double and should return the raw tuple value
    if (token.name === "metadata") {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return entry.filter(({ slug }) => {
      if (Array.isArray(token.value)) {
        return token.value.includes(slug);
      }

      return slug === token.value;
    });
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "channel":
        return this.channel;
      case "published":
        return this.published;
      case "metadata":
        return this.metadata;
      default:
        return [];
    }
  }
}
