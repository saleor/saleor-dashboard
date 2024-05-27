import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

// import { InitialState } from "../../InitialStateResponse";

interface _InitialOrderState {
  paymentStatus: ItemOption[];
  status: ItemOption[];
  isClickAndCollect: ItemOption[];
  // TODO: rest
}

export class InitialOrderState implements _InitialOrderState {
  constructor(
    public paymentStatus: ItemOption[] = [],
    public status: ItemOption[] = [],
    public authorizeStatus: ItemOption[] = [],
    public chargeStatus: ItemOption[] = [],
    public channels: ItemOption[] = [],
    public isClickAndCollect: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialOrderState();
  }

  public filterByUrlToken(token: UrlToken) {
    return this.getEntryByName(token.name);
  }

  private getEntryByName(name: string) {
    return this[name];
  }
}
