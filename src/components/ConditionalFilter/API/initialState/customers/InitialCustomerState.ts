import { type ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { type UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialCustomerState {
  customerType: ItemOption[];
}

export class InitialCustomerStateResponse implements InitialCustomerState {
  constructor(public customerType: ItemOption[] = []) {}

  public static empty() {
    return new InitialCustomerStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (token.name === "metadata") {
      return token.value;
    }

    if (token.name === "dateJoined" || token.name === "numberOfOrders") {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return entry.filter(({ slug }) => {
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
      case "customerType":
        return this.customerType;
      default:
        return [];
    }
  }
}
