import { type ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { type UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

import {
  type AttributeDTO,
  type AttributeLookup,
  resolveAttributeTokenValue,
} from "../product/InitialProductStateResponse";

export interface InitialCustomerState {
  customerType: ItemOption[];
  attribute: Record<string, AttributeDTO>;
}

export class InitialCustomerStateResponse implements InitialCustomerState, AttributeLookup {
  constructor(
    public customerType: ItemOption[] = [],
    public attribute: Record<string, AttributeDTO> = {},
  ) {}

  public static empty() {
    return new InitialCustomerStateResponse();
  }

  public attributeByName(name: string) {
    return this.attribute[name];
  }

  public filterByUrlToken(token: UrlToken) {
    const attributeValue = resolveAttributeTokenValue(this.attribute, token);

    if (attributeValue !== undefined) {
      return attributeValue;
    }

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
