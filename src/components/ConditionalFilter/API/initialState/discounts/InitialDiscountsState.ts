import { type ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { type UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialDiscountsState {
  promotionStatus: ItemOption[];
  promotionType: ItemOption[];
}

const isDateField = (name: string) => ["startDate", "endDate"].includes(name);

export class InitialDiscountsStateResponse implements InitialDiscountsState {
  constructor(
    public promotionStatus: ItemOption[] = [],
    public promotionType: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialDiscountsStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (isDateField(token.name)) {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => {
      if (!slug) {
        return false;
      }

      if (Array.isArray(token.value)) {
        return token.value.includes(slug);
      }

      return slug === token.value;
    });
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "promotionStatus":
        return this.promotionStatus;
      case "promotionType":
        return this.promotionType;
      default:
        return [];
    }
  }
}
