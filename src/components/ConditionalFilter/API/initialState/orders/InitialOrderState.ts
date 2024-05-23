import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";

import { InitialState } from "../../InitialStateResponse";

interface _InitialOrderState {
  paymentStatus: ItemOption[];
  status: ItemOption[];
  // TODO: rest
}

export class InitialOrderState implements _InitialOrderState {
  constructor(
    public paymentStatus: ItemOption[] = [],
    public status: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialOrderState();
  }

  public filterByUrlToken(token: string) {
    if (token === "paymentStatus") {
      return this.paymentStatus;
    }

    if (token === "status") {
      return this.status;
    }

    return [];
  }

  private getEntryByName(name: string) {
    return this[name];
  }
}
