import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialVouchersState {
  channels: ItemOption[];
  discountType: ItemOption[];
  status: ItemOption[];
}

export class InitialVouchersStateResponse implements InitialVouchersState {
  constructor(
    public channels: ItemOption[] = [],
    public discountType: ItemOption[] = [],
    public status: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialVouchersStateResponse();
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
      case "channels":
        return this.channels;
      case "discountType":
        return this.discountType;
      case "status":
        return this.status;
      default:
        return [];
    }
  }
}
